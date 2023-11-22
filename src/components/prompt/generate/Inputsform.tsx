import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { Button, Fade, InputLabel, MenuItem, Select, Stack, TextField, Tooltip } from "@mui/material";
import { IAnswer } from "@/common/types/chat";
import BaseButton from "@/components/base/BaseButton";
import CodeFieldModal from "@/components/modals/CodeFieldModal";
import { useAppSelector } from "@/hooks/useStore";
import { getFileTypeExtensionsAsString } from "@/common/helpers/uploadFileHelper";
import { FileType, IPromptInputQuestion } from "@/common/types/prompt";
import { Edit, Error } from "@mui/icons-material";
interface Props {
  inputs: IPromptInputQuestion[];
  answers: IAnswer[];
  onChange: (value: string | File, question: IPromptInputQuestion) => void;
  setIsSimulationStreaming: Dispatch<SetStateAction<boolean>>;
  onScrollToBottom: () => void;
}

export const InputsForm = ({ inputs, answers, onChange, setIsSimulationStreaming, onScrollToBottom }: Props) => {
  const isGenerating = useAppSelector(state => state.template.isGenerating);
  const [codeFieldOpen, setCodeFieldOpen] = useState(false);
  const fieldRefs = useRef<(HTMLInputElement | null)[]>(Array(inputs.length).fill(null));

  const handleInputsShown = () => {
    setIsSimulationStreaming(false);
    onScrollToBottom();
  };

  return (
    <Fade
      in={true}
      unmountOnExit
      timeout={800}
      onTransitionEnd={handleInputsShown}
    >
      <Stack gap={1}>
        {inputs.map((input, idx) => {
          const { name, required, question, fullName, type, choices, fileExtensions } = input;
          const answer = answers.find(answer => answer.inputName === name);
          const value = answer?.answer || "";
          const isFile = value instanceof File;
          const dynamicWidth = () => {
            const textMeasureElement = document.createElement("span");
            textMeasureElement.style.fontSize = "14px";
            textMeasureElement.style.fontWeight = "400";
            textMeasureElement.style.position = "absolute";
            textMeasureElement.style.visibility = "hidden";
            textMeasureElement.innerHTML = value.toString() || (required ? "Required" : "Optional");
            document.body.appendChild(textMeasureElement);
            const width = textMeasureElement.offsetWidth;
            document.body.removeChild(textMeasureElement);
            return width;
          };

          return (
            <Stack
              key={idx}
              direction={"row"}
              alignItems={"center"}
              gap={1}
            >
              <InputLabel
                sx={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#375CA9",
                  overflow: "visible",
                }}
              >
                {fullName} :
              </InputLabel>
              {type === "code" ? (
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
                      border: "1px solid",
                      borderRadius: "8px",
                      borderColor: answer?.error ? "error.main" : "secondary.main",
                      color: "secondary.main",
                      p: "3px 12px",
                      ":hover": {
                        bgcolor: "action.hover",
                      },
                    }}
                  >
                    {!isFile && value ? value : "Insert Code"}
                  </BaseButton>
                  {codeFieldOpen && (
                    <CodeFieldModal
                      open
                      setOpen={setCodeFieldOpen}
                      value={value as string}
                      onSubmit={val => onChange(val, input)}
                    />
                  )}
                </>
              ) : type === "choices" ? (
                <Select
                  disabled={isGenerating}
                  sx={{
                    ".MuiSelect-select": {
                      p: "3px 12px",
                      fontSize: 14,
                      fontWeight: 400,
                      opacity: value ? 1 : 0.7,
                    },
                    ".MuiOutlinedInput-notchedOutline, .Mui-focused": {
                      borderRadius: "8px",
                      borderWidth: "1px !important",
                      borderColor: answer?.error ? "error.main" : "secondary.main",
                    },
                  }}
                  MenuProps={{
                    sx: { ".MuiMenuItem-root": { fontSize: 14, fontWeight: 400 } },
                  }}
                  value={value}
                  onChange={e => onChange(e.target.value as string, input)}
                  displayEmpty
                >
                  <MenuItem
                    value=""
                    sx={{ opacity: 0.7 }}
                  >
                    Select an option
                  </MenuItem>
                  {choices?.map(choice => (
                    <MenuItem
                      key={choice}
                      value={choice}
                      selected={value === choice}
                    >
                      {choice}
                    </MenuItem>
                  ))}
                </Select>
              ) : type === "file" ? (
                <Stack
                  direction={"row"}
                  alignItems={"center"}
                  gap={1}
                >
                  <Button
                    component="label"
                    sx={{
                      border: "1px solid",
                      borderColor: answer?.error ? "error.main" : "secondary.main",
                      color: "secondary.main",
                      p: "3px 12px",
                      ":hover": {
                        bgcolor: "action.hover",
                      },
                    }}
                  >
                    {isFile ? value.name : "Upload file"}
                    <input
                      hidden
                      accept={getFileTypeExtensionsAsString(fileExtensions as FileType[])}
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
                          onChange(e.target.files[0], input);
                        }
                      }}
                    />
                  </Button>
                  {answer?.error && (
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
                <>
                  <TextField
                    inputRef={ref => (fieldRefs.current[idx] = ref)}
                    disabled={isGenerating}
                    placeholder={required ? "Required" : "Optional"}
                    type={type}
                    value={value}
                    onChange={e => onChange(e.target.value, input)}
                    sx={{
                      width: dynamicWidth(),
                      p: 0,
                      ".MuiInputBase-input": {
                        p: 0,
                        color: "onSurface",
                        fontSize: 14,
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
                  />
                  <Edit
                    onClick={() => fieldRefs.current[idx]?.focus()}
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
                </>
              )}
            </Stack>
          );
        })}
      </Stack>
    </Fade>
  );
};
