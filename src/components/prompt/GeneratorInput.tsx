import React, { useEffect, useState } from "react";
import { Box, Divider, IconButton, InputLabel, Stack, TextField } from "@mui/material";
import { InputsErrors } from "./form/InputMode";
import { Backspace } from "@mui/icons-material";
import { ResInputs } from "@/core/api/dto/prompts";
import { IPromptInput } from "@/common/types/prompt";
import BaseButton from "../base/BaseButton";
import CodeFieldModal from "../modals/CodeFieldModal";

interface GeneratorInputProps {
  promptId: number;
  inputs: IPromptInput[];
  resInputs: ResInputs[];
  setNodeInputs: (obj: any) => void;
  errors: InputsErrors;
}

export const GeneratorInput: React.FC<GeneratorInputProps> = ({
  promptId,
  inputs,
  setNodeInputs,
  resInputs,
  errors,
}) => {
  const [codeFieldOpen, setCodeFieldOpen] = useState(false);

  const handleChange = (value: string, name: string, type: string) => {
    const resObj = resInputs.find(prompt => prompt.inputs[name]);
    const resArr = [...resInputs];

    if (!resObj) {
      return setNodeInputs([
        ...resInputs,
        {
          id: promptId,
          inputs: {
            [name]: {
              value: type === "number" ? +value : value,
            },
          },
        },
      ]);
    }

    resArr.forEach((prompt: any, index: number) => {
      if (prompt.id === promptId) {
        resArr[index] = {
          ...prompt,
          inputs: {
            ...prompt.inputs,
            [name]: {
              value: type === "number" ? +value : value,
              required: resObj.inputs[name].required,
            },
          },
        };
      }
    });

    setNodeInputs([...resArr]);
  };

  return inputs.length > 0 ? (
    <Box>
      {inputs.map((input, index) => {
        const inputValue = resInputs.find(prompt => prompt.id === promptId)?.inputs[input.name]?.value || "";

        return (
          <React.Fragment key={index}>
            <Stack
              direction={"row"}
              alignItems={"center"}
              gap={1}
              sx={{ p: "16px 8px 16px 16px" }}
            >
              <InputLabel
                sx={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: errors[input.name] ? "error.main" : "tertiary",
                  height: "27px",
                }}
              >
                {input.fullName} {input.required ? "*" : ""} :
              </InputLabel>
              {input.type === "code" ? (
                <>
                  <BaseButton
                    size="small"
                    onClick={() => {
                      setCodeFieldOpen(true);
                    }}
                    color="custom"
                    variant="text"
                    sx={{ border: "1px solid", borderRadius: "8px" }}
                  >
                    {inputValue ? "Edit Code" : "Insert Code"}
                  </BaseButton>
                  <CodeFieldModal
                    open={codeFieldOpen}
                    setOpen={setCodeFieldOpen}
                    value={inputValue as string}
                    onChange={val => handleChange(val, input.name, input.type)}
                  />
                </>
              ) : (
                <>
                  <TextField
                    sx={{
                      flex: 1,
                      height: "27px",
                      ".MuiInputBase-input": {
                        p: 0,
                        color: "onSurface",
                        fontSize: 13,
                        fontWeight: 500,
                        "&::placeholder": {
                          color: "grey.600",
                          opacity: 1,
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
                    placeholder={input.type === "number" ? "Write a number here.." : "Type here..."}
                    type={input.type}
                    value={inputValue}
                    onChange={e => handleChange(e.target.value, input.name, input.type)}
                  />
                  <IconButton
                    sx={{
                      color: "grey.600",
                      border: "none",
                      p: "4px",
                      ":hover": {
                        color: "tertiary",
                      },
                      display: inputValue ? "inline-flex" : "none",
                      height: "27px",
                    }}
                    onClick={() => handleChange("", input.name, input.type)}
                  >
                    <Backspace />
                  </IconButton>
                </>
              )}
            </Stack>
          </React.Fragment>
        );
      })}
    </Box>
  ) : null;
};
