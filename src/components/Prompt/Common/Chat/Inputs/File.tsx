import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import { getFileTypeExtensionsAsString } from "@/components/Prompt/Utils/uploadFileHelper";
import useTruncate from "@/hooks/useTruncate";
import type { FileType, IPromptInput } from "@/common/types/prompt";
interface Props {
  value: File;
  input: IPromptInput;
  onChange: (value: string | File, input: IPromptInput) => void;
}

function File({ input, value, onChange }: Props) {
  const { truncate } = useTruncate();
  const _value = value && typeof value === "string" ? "Previously uploaded file" : value?.name;

  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      gap={1}
    >
      <Button
        component="label"
        variant="contained"
        sx={{ border: "1px solid", p: "3px 12px", fontSize: { xs: 12, md: 14 }, fontWeight: 500 }}
      >
        {_value ? truncate(_value, { length: 20 }) : "Upload file"}
        <input
          hidden
          accept={getFileTypeExtensionsAsString(input.fileExtensions as FileType[])}
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
              onChange(e.target.files[0], input);
            }
          }}
        />
      </Button>
    </Stack>
  );
}

export default File;
