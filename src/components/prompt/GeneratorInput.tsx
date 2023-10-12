import React, { useState } from "react";
import { Box, Divider, IconButton, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import { Backspace } from "@mui/icons-material";

import { InputsErrors } from "./GeneratorForm";
import { AnsweredInputType, IPromptInput } from "@/common/types/prompt";
import BaseButton from "../base/BaseButton";
import CodeFieldModal from "../modals/CodeFieldModal";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { ResInputs } from "@/core/api/dto/prompts";
import { useDebouncedDispatch } from "@/hooks/useDebounceDispatch";
import { updateAnsweredInput } from "@/core/store/templatesSlice";

interface GeneratorInputProps {
  promptId: number;
  inputs: IPromptInput[];
  nodeInputs: ResInputs[];
  setNodeInputs: (updatedNodes: ResInputs[]) => void;
  errors: InputsErrors;
}

export const GeneratorInput: React.FC<GeneratorInputProps> = ({
  promptId,
  inputs,
  nodeInputs,
  setNodeInputs,
  errors,
}) => {
  const dispatch = useAppDispatch();
  const isGenerating = useAppSelector(state => state.template.isGenerating);
  const [codeFieldOpen, setCodeFieldOpen] = useState(false);

  const debouncedDispatch = useDebouncedDispatch((answeredInputsArray: AnsweredInputType[]) => {
    dispatch(updateAnsweredInput(answeredInputsArray));
  }, 700);

  const handleChange = (value: string, name: string, type: string) => {
    let newValue: AnsweredInputType = {
      inputName: name,
      promptId,
      value,
      modifiedFrom: "input",
    };
    const updatedNodes = nodeInputs.map(node => {
      const targetNode = node.inputs[name];
      if (targetNode) {
        return {
          ...node,
          inputs: {
            ...node.inputs,
            [name]: {
              ...targetNode,
              value: type === "number" ? +value : value,
            },
          },
        };
      }
      return node;
    });
    setNodeInputs(updatedNodes);
    debouncedDispatch([newValue]);
  };

  return inputs.length > 0 ? (
    <Box>
      {inputs.map((input, index) => {
        const value = nodeInputs.find(prompt => prompt.id === promptId)?.inputs[input.name]?.value || "";

        return (
          <React.Fragment key={index}>
            <Divider sx={{ borderColor: "surface.3" }} />
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
                    disabled={isGenerating}
                    size="small"
                    onClick={() => {
                      setCodeFieldOpen(true);
                    }}
                    color="custom"
                    variant="text"
                    sx={{
                      flex: 1,
                      border: "1px solid",
                      borderRadius: "8px",
                      color: errors[input.name] ? "error.main" : "tertiary",
                    }}
                  >
                    {value ? "Edit Code" : "Insert Code"}
                  </BaseButton>
                  <CodeFieldModal
                    open={codeFieldOpen}
                    setOpen={setCodeFieldOpen}
                    value={value as string}
                    onChange={val => handleChange(val, input.name, input.type)}
                  />
                </>
              ) : input.type === "choices" ? (
                <Select
                  disabled={isGenerating}
                  sx={{
                    flex: 1,
                    ".MuiSelect-select": {
                      p: "7px 20px",
                      fontSize: 13,
                      fontWeight: 500,
                      opacity: value ? 1 : 0.7,
                    },
                    ".MuiOutlinedInput-notchedOutline": {
                      border: "1px solid",
                      borderRadius: "8px",
                      color: errors[input.name] ? "error.main" : "tertiary",
                      borderColor: "inherit !important",
                      borderWidth: "1px !important",
                    },
                  }}
                  MenuProps={{
                    sx: { ".MuiMenuItem-root": { fontSize: 14, fontWeight: 500 } },
                  }}
                  value={value}
                  onChange={e => handleChange(e.target.value as string, input.name, input.type)}
                  displayEmpty
                >
                  <MenuItem
                    value=""
                    sx={{ opacity: 0.7 }}
                  >
                    Select an option
                  </MenuItem>
                  {input.choices?.map(choice => (
                    <MenuItem
                      key={choice}
                      value={choice}
                      selected={value === choice}
                    >
                      {choice}
                    </MenuItem>
                  ))}
                </Select>
              ) : (
                <TextField
                  disabled={isGenerating}
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
                  value={value}
                  onChange={e => handleChange(e.target.value, input.name, input.type)}
                />
              )}
              <IconButton
                disabled={isGenerating}
                sx={{
                  color: "grey.600",
                  border: "none",
                  p: "4px",
                  ":hover": {
                    color: "tertiary",
                  },
                  visibility: value ? "visible" : "hidden",
                  height: "27px",
                }}
                onClick={() => handleChange("", input.name, input.type)}
              >
                <Backspace />
              </IconButton>
            </Stack>
          </React.Fragment>
        );
      })}
    </Box>
  ) : null;
};
