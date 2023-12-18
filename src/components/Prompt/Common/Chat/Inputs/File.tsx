import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import { FileType, IPromptInput } from "@/common/types/prompt";
import { getFileTypeExtensionsAsString } from "@/components/Prompt/Utils/uploadFileHelper";
interface Props {
  isFile: boolean;
  value: File;
  input: IPromptInput;
  onChange: (value: string | File, input: IPromptInput) => void;
}

function File({ input, isFile, value, onChange }: Props) {
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
        {isFile ? value.name : "Upload file"}
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
