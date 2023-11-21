import React, { useEffect, useState } from "react";
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
import { AnsweredInputType, IPromptInput, FileType } from "@/common/types/prompt";
import BaseButton from "../base/BaseButton";
import CodeFieldModal from "../modals/CodeFieldModal";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { ResInputs } from "@/core/api/dto/prompts";
import { getFileTypeExtensionsAsString } from "@/common/helpers/uploadFileHelper";
import { useDebouncedDispatch } from "@/hooks/useDebounceDispatch";

interface GeneratorInputProps {
  promptId: number;
  inputData: IPromptInput;
  nodeInputs: ResInputs[];
  setNodeInputs: (updatedNodes: ResInputs[]) => void;
  error: boolean;
}

export const GeneratorInput: React.FC<GeneratorInputProps> = ({
  promptId,
  inputData,
  nodeInputs,
  setNodeInputs,
  error,
}) => {
  const [_error, setError] = useState(error);

  useEffect(() => setError(error), [error]);

  const dispatch = useAppDispatch();
  const isGenerating = useAppSelector(state => state.template.isGenerating);
  const [codeFieldOpen, setCodeFieldOpen] = useState(false);

  const handleChange = (value: string | File, name: string, type: string) => {
    setError(false);

    let newValue: AnsweredInputType = {
      inputName: name,
      promptId,
      value,
      modifiedFrom: "input",
    };
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

  const value = nodeInputs.find(prompt => prompt.id === promptId)?.inputs[inputData.name]?.value || "";

  return (
    <Box>
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
            color: _error ? "error.main" : "tertiary",
            height: "27px",
          }}
        >
          {inputData.fullName} {inputData.required ? "*" : ""} :
        </InputLabel>
        {inputData.type === "code" ? (
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
                color: _error ? "error.main" : "tertiary",
              }}
            >
              {value ? "Edit Code" : "Insert Code"}
            </BaseButton>
            {codeFieldOpen && (
              <CodeFieldModal
                open
                setOpen={setCodeFieldOpen}
                value={value as string}
                onSubmit={val => handleChange(val, inputData.name, inputData.type)}
              />
            )}
          </>
        ) : inputData.type === "choices" ? (
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
                color: _error ? "error.main" : "tertiary",
                borderColor: "inherit !important",
                borderWidth: "1px !important",
              },
            }}
            MenuProps={{
              sx: { ".MuiMenuItem-root": { fontSize: 14, fontWeight: 500 } },
            }}
            value={value}
            onChange={e => handleChange(e.target.value as string, inputData.name, inputData.type)}
            displayEmpty
          >
            <MenuItem
              value=""
              sx={{ opacity: 0.7 }}
            >
              Select an option
            </MenuItem>
            {inputData.choices?.map(choice => (
              <MenuItem
                key={choice}
                value={choice}
                selected={value === choice}
              >
                {choice}
              </MenuItem>
            ))}
          </Select>
        ) : inputData.type === "file" ? (
          <Stack
            direction={"row"}
            alignItems={"center"}
            gap={1}
            flex={1}
          >
            <Button
              component="label"
              variant="contained"
              sx={{ border: "2px solid", borderColor: _error ? "error.main" : "" }}
            >
              Upload file
              <input
                hidden
                accept={getFileTypeExtensionsAsString(inputData.fileExtensions as FileType[])}
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
                    handleChange(e.target.files[0], inputData.name, inputData.type);
                  }
                }}
              />
            </Button>
            {_error && (
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
            placeholder={inputData.type === "number" ? "Write a number here.." : "Type here..."}
            type={inputData.type}
            value={value}
            onChange={e => handleChange(e.target.value, inputData.name, inputData.type)}
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
          onClick={() => handleChange("", inputData.name, inputData.type)}
        >
          <Backspace />
        </IconButton>
      </Stack>
    </Box>
  );
};
