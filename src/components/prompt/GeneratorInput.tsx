import React, { useState } from "react";
import {
  Box,
  Button,
  Divider,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import { Backspace, Error } from "@mui/icons-material";
import { InputsErrors } from "./GeneratorForm";
import { FileType, IPromptInput } from "@/common/types/prompt";
import BaseButton from "../base/BaseButton";
import CodeFieldModal from "../modals/CodeFieldModal";
import { useAppSelector } from "@/hooks/useStore";
import { ResInputs } from "@/core/api/dto/prompts";
import { getFileTypeExtensionsAsString } from "@/common/helpers/uploadFileHelper";

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
  const isGenerating = useAppSelector(state => state.template.isGenerating);
  const [codeFieldOpen, setCodeFieldOpen] = useState(false);

  const handleChange = (value: string | File, name: string, type: string) => {
    const updatedNodes = nodeInputs.map(node => {
      const targetInput = node.inputs[name];
      if (targetInput) {
        node.inputs[name] = {
          ...targetInput,
          value: type === "number" ? +value : value,
        };
      }
      return node;
    });

    setNodeInputs(updatedNodes);
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
              ) : input.type === "file" ? (
                <Stack
                  direction={"row"}
                  alignItems={"center"}
                  gap={1}
                >
                  <Button
                    component="label"
                    variant="contained"
                    sx={{ border: "2px solid", borderColor: errors[input.name] ? "error.main" : "" }}
                  >
                    Upload file
                    <input
                      hidden
                      accept={getFileTypeExtensionsAsString(input.fileExtensions as FileType[])}
                      type="file"
                      style={{
                        flex: 1,
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
                          handleChange(e.target.files[0], input.name, input.type);
                        }
                      }}
                    />
                  </Button>
                  {errors[input.name] && (
                    <Tooltip
                      title={"The uploaded file is invalid"}
                      placement="right"
                      arrow
                      componentsProps={{
                        tooltip: {
                          sx: { bgcolor: "error.main", color: "onError", fontSize: 10, fontWeight: 500 },
                        },
                        arrow: {
                          sx: { color: "error.main" },
                        },
                      }}
                    >
                      <Error sx={{ color: "error.main", width: 20, height: 20 }} />
                    </Tooltip>
                  )}
                </Stack>
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
