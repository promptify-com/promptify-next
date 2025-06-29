import { useState } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { getFileTypeExtensionsAsString } from "@/components/Prompt/Utils/uploadFileHelper";
import useTruncate from "@/hooks/useTruncate";
import type { FileType, IPromptInput } from "@/common/types/prompt";
import { isUrl } from "@/common/helpers";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import Tooltip from "@mui/material/Tooltip";
import Error from "@mui/icons-material/Error";
import { initialState, setFileData } from "@/core/store/chatSlice";

interface Props {
  value: File;
  input: IPromptInput;
  onChange: (value: string | File, input: IPromptInput) => void;
  disabled?: boolean;
  inputType: string;
}

function File({ input, value, onChange, disabled, inputType }: Props) {
  const dispatch = useAppDispatch();
  const { truncate } = useTruncate();
  const answers = useAppSelector(state => state.chat?.answers ?? initialState.answers);
  const [fileError, setFileError] = useState<string | null>(null);

  const _value = value && typeof value === "string" && isUrl(value) ? (value as string).split("/").pop() : value?.name;
  const hasError = answers.find(answer => answer.inputName === input.name && answer.error);
  const acceptedTypes =
    inputType === "file"
      ? getFileTypeExtensionsAsString(input?.fileExtensions as FileType[])
      : getFileTypeExtensionsAsString(input?.audioExtensions as FileType[]);

  const MAX_AUDIO_SIZE_MB = 25;
  const MAX_AUDIO_SIZE_BYTES = MAX_AUDIO_SIZE_MB * 1024 * 1024;

  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      gap={1}
    >
      <Button
        component="label"
        variant="contained"
        disabled={disabled}
        sx={{ border: "1px solid", p: "3px 12px", fontSize: { xs: 12, md: 14 }, fontWeight: 500 }}
      >
        {_value ? truncate(_value, { length: 20 }) : inputType === "file" ? "Upload file" : "Upload audio"}
        <input
          hidden
          accept={acceptedTypes}
          type="file"
          style={{
            clip: "rect(0 0 0 0)",
            clipPath: "inset(50%)",
            height: "auto",
            overflow: "hidden",
            position: "absolute",
            whiteSpace: "nowrap",
            width: 1,
          }}
          onChange={e => {
            if (e.target.files && e.target.files.length > 0) {
              const file = e.target.files[0];

              if (inputType === "audio" && file.size > MAX_AUDIO_SIZE_BYTES) {
                setFileError(`Audio file size should not exceed ${MAX_AUDIO_SIZE_MB}MB.`);
                return;
              }

              setFileError(null);
              onChange(file, input);
              dispatch(setFileData(file as File));
            }
          }}
        />
      </Button>
      {(hasError || fileError) && (
        <Tooltip
          title={fileError || "The uploaded file is invalid"}
          placement="right"
          arrow
          componentsProps={{
            tooltip: {
              sx: { bgcolor: "error.main", color: "onError", fontSize: 10, fontWeight: 500 },
            },
            arrow: {
              sx: { color: "error.main" },
            },
          }}
        >
          <Error sx={{ color: "error.main", width: 20, height: 20 }} />
        </Tooltip>
      )}
    </Stack>
  );
}

export default File;
