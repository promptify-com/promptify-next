import { useEffect, useRef } from "react";
import Edit from "@mui/icons-material/Edit";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import useVariant from "@/components/Prompt/Hooks/useVariant";
import { useAppSelector } from "@/hooks/useStore";
import type { IPromptInput } from "@/common/types/prompt";
import type { PromptInputType } from "@/components/Prompt/Types";

interface Props {
  input: IPromptInput;
  value: PromptInputType;
  onChange: (value: string | File) => void;
  onBlur: () => void;
}

function Textual({ input, value, onChange, onBlur }: Props) {
  const { type, required } = input;

  const { isVariantB } = useVariant();
  const isGenerating = useAppSelector(state => state.template.isGenerating);

  const fieldRef = useRef<HTMLInputElement | null>(null);
  const spanRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    calculateInputWidth();
  }, [value]);

  const calculateInputWidth = () => {
    if (spanRef.current && fieldRef.current) {
      const spanWidth = spanRef.current.offsetWidth;
      const minWidth = Math.max(spanWidth, isVariantB ? 70 : 60);
      fieldRef.current.style.width = isVariantB ? "-webkit-fill-available" : `${minWidth}px`;
    }
  };

  return (
    <Stack
      direction={"row"}
      gap={1}
      position={"relative"}
      alignItems={"center"}
      width={"100%"}
    >
      <TextField
        inputRef={ref => (fieldRef.current = ref)}
        fullWidth={isVariantB}
        disabled={isGenerating}
        sx={textFieldStyle}
        placeholder={isVariantB ? "Type here" : required ? "Required" : "Optional"}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={onBlur}
      />

      <span
        ref={spanRef}
        style={{
          position: "absolute",
          fontSize: 14,
          visibility: "hidden",
          height: "auto",
          width: "auto",
          whiteSpace: "pre",
        }}
      >
        {value as string}
      </span>
      {!isVariantB && (
        <Edit
          onClick={() => fieldRef.current?.focus()}
          sx={{
            fontSize: 16,
            color: "primary.main",
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

export default Textual;

const textFieldStyle = {
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
};
