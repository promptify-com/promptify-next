import { useRef } from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useAppSelector } from "@/hooks/useStore";
import type { IPromptInput } from "@/common/types/prompt";
import type { PromptInputType } from "@/components/Prompt/Types";
import useVariant from "@/components/Prompt/Hooks/useVariant";

interface Props {
  input: IPromptInput;
  value: PromptInputType;
  onChange: (value: string | File) => void;
}

function Textual({ input, value, onChange }: Props) {
  const type = input.type;
  const { isAutomationPage } = useVariant();

  const isGenerating = useAppSelector(state => state.templates?.isGenerating ?? false);
  const areAllCredentialsStored = useAppSelector(state => state.chat?.areCredentialsStored ?? false);

  const fieldRef = useRef<HTMLInputElement | null>(null);

  const disableInput = Boolean(isGenerating || (!areAllCredentialsStored && isAutomationPage));

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
        fullWidth
        disabled={disableInput}
        sx={textFieldStyle}
        placeholder={"Type here"}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </Stack>
  );
}

export default Textual;

const textFieldStyle = {
  ".MuiInputBase-input": {
    p: 0,
    color: "onSurface",
    fontSize: { xs: 12, md: 12 },
    fontWeight: 400,
    "&::placeholder": {
      color: "text.secondary",
      opacity: 0.5,
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
