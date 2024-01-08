import InputLabel from "@mui/material/InputLabel";
import Stack from "@mui/material/Stack";
import RenderInputType from "@/components/common/forms/Inputs";
import type { IPromptInput } from "@/common/types/prompt";
import { PromptInputType } from "@/components/Prompt/Types";
import { Box } from "@mui/material";
import { useState } from "react";
import { IInputValue } from "../../Types";

interface Props {
  input: IPromptInput;
  onChange: (value: IInputValue) => void;
}

function FormInput({ input, onChange }: Props) {
  const { fullName, required, type, name: inputName, question, prompt } = input;
  const [value, setValue] = useState<PromptInputType>("");
  const isTextualType = type === "text" || type === "number" || type === "integer";

  const handleChange = (value: PromptInputType) => {
    setValue(value);
    const isEmptyTextualInput = isTextualType && typeof value === "string" && value.trim() === "";
    if (!isEmptyTextualInput) {
      onChange({
        inputName,
        value,
      });
    }
  };

  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      gap={1}
      p={"16px"}
      borderBottom={"1px solid #ECECF4"}
    >
      <Box>
        <InputLabel
          sx={{
            fontSize: { xs: 12, md: 15 },
            fontWeight: 500,
            color: "primary.main",
          }}
        >
          {fullName} {required && <span>*</span>} :
        </InputLabel>
      </Box>

      <Stack
        display={"flex"}
        alignItems={"start"}
        position={"relative"}
        flex={1}
        width={"100%"}
      >
        <RenderInputType
          input={input}
          value={value}
          onChange={handleChange}
        />
      </Stack>
    </Stack>
  );
}

export default FormInput;
