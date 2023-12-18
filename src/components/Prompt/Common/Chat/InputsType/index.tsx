import TextField from "@mui/material/TextField";

import Code from "@/components/Prompt/Common/Chat/InputsType/Code";
import Choices from "@/components/Prompt/Common/Chat/InputsType/Choices";
import File from "@/components/Prompt/Common/Chat/InputsType/File";
import type { IPromptInput } from "@/common/types/prompt";

interface Props {
  input: IPromptInput;
  isGenerating: boolean;
  isFile: boolean;
  value: string | number | File;
  onChange: (value: string | File, input: IPromptInput) => void;
}

function RenderInputType({ input, isGenerating, isFile, onChange, value }: Props) {
  switch (input.type) {
    case "code":
      return (
        <Code
          input={input}
          onChange={onChange}
          value={value}
          isGenerating={isGenerating}
          isFile={isFile}
        />
      );
    case "choices":
      return (
        <Choices
          input={input}
          value={value}
          onChange={onChange}
          isGenerating={isGenerating}
        />
      );
    case "file":
      return (
        <File
          input={input}
          value={value as File}
          isFile={isFile}
          onChange={onChange}
        />
      );
    default:
      return (
        <TextField
          fullWidth
          disabled={isGenerating}
          sx={{
            ".MuiInputBase-input": {
              p: 0,
              color: "onSurface",
              fontSize: { xs: 12, md: 14 },
              fontWeight: 400,
              "&::placeholder": {
                color: "text.secondary",
                opacity: 0.65,
              },
              "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                WebkitAppearance: "none",
                margin: 0,
              },
              "&[type=number]": {
                MozAppearance: "textfield",
              },
            },
            ".MuiOutlinedInput-notchedOutline": {
              border: 0,
            },
            ".MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
              border: 0,
            },
          }}
          placeholder={"Type here"}
          type={input.type}
          value={value}
          onChange={e => onChange(e.target.value, input)}
        />
      );
  }
}

export default RenderInputType;
