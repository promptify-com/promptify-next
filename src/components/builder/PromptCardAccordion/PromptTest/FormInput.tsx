import InputLabel from "@mui/material/InputLabel";
import Stack from "@mui/material/Stack";
import RenderInputType from "@/components/common/forms/Inputs";
import type { IPromptInput } from "@/common/types/prompt";
import { PromptInputType } from "@/components/Prompt/Types";
import Box from "@mui/material/Box";
import { useState } from "react";
import { InputValue } from "@/components/builder/Types";
import TextField from "@mui/material/TextField";

interface Props {
  input: IPromptInput;
  onChange: (value: InputValue) => void;
}

function FormInput({ input, onChange }: Props) {
  const { fullName, type, name } = input;
  const [value, setValue] = useState<PromptInputType>("");
  const isTextualType = ["text", "number", "integer"].includes(type);

  const handleChange = (value: PromptInputType) => {
    setValue(value);
    const isEmpty = typeof value === "string" && !value.trim();
    if (isTextualType && !isEmpty) {
      onChange({
        name,
        value,
      });
    }
  };

  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      gap={1}
      p={"6px"}
    >
      {!isTextualType && (
        <Box>
          <InputLabel
            sx={{
              fontSize: { xs: 12, md: 15 },
              fontWeight: 500,
              color: "primary.main",
            }}
          >
            {fullName} :
          </InputLabel>
        </Box>
      )}

      <Stack flex={1}>
        {isTextualType ? (
          <TextField
            label={input.fullName}
            type={type}
            value={value}
            onChange={e => handleChange(e.target.value)}
            sx={{
              ".MuiFormLabel-root": { fontWeight: 500, color: "primary.main" },
            }}
          />
        ) : (
          <RenderInputType
            input={input}
            value={value}
            onChange={handleChange}
          />
        )}
      </Stack>
    </Stack>
  );
}

export default FormInput;
