import { useRef } from "react";
import { useRouter } from "next/router";
import TextField from "@mui/material/TextField";
import Edit from "@mui/icons-material/Edit";

import Code from "@/components/Prompt/Common/Chat/Inputs/Code";
import Choices from "@/components/Prompt/Common/Chat/Inputs/Choices";
import File from "@/components/Prompt/Common/Chat/Inputs/File";
import type { IPromptInput } from "@/common/types/prompt";
import { Stack } from "@mui/material";

interface Props {
  input: IPromptInput;
  isGenerating: boolean;
  isFile: boolean;
  value: string | number | File;
  onChange: (value: string | File, input: IPromptInput) => void;
}

function RenderInputType({ input, isGenerating, isFile, onChange, value }: Props) {
  const router = useRouter();
  const variant = router.query.variant;
  const fieldRef = useRef<HTMLInputElement | null>(null);

  const dynamicWidth = () => {
    const textMeasureElement = document.createElement("span");
    textMeasureElement.style.fontSize = "14px";
    textMeasureElement.style.fontWeight = "400";
    textMeasureElement.style.position = "absolute";
    textMeasureElement.style.visibility = "hidden";
    textMeasureElement.innerHTML = value.toString() || (input.required ? "Required" : "Optional");
    document.body.appendChild(textMeasureElement);
    const width = textMeasureElement.offsetWidth;
    document.body.removeChild(textMeasureElement);
    return width;
  };

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
        <Stack
          direction={"row"}
          gap={1}
          position={"relative"}
        >
          <TextField
            inputRef={ref => (fieldRef.current = ref)}
            fullWidth={variant === "b"}
            disabled={isGenerating}
            sx={{
              ".MuiInputBase-input": {
                width: variant === "a" ? dynamicWidth() : "auto",
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
          {variant === "a" && (
            <Edit
              onClick={() => fieldRef.current?.focus()}
              sx={{
                fontSize: 16,
                color: "#375CA9",
                p: "4px",
                cursor: "pointer",
                opacity: value ? 0.9 : 0.45,
                ":hover": {
                  opacity: 1,
                },
              }}
            />
          )}
        </Stack>
      );
  }
}

export default RenderInputType;
