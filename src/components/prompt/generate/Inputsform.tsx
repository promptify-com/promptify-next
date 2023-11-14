import React, { useState } from "react";
import { Box, Button, IconButton, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { IAnswer } from "@/common/types/chat";
import { UpdatedQuestionTemplate } from "@/core/api/dto/templates";
import BaseButton from "@/components/base/BaseButton";
import CodeFieldModal from "@/components/modals/CodeFieldModal";
import { useAppSelector } from "@/hooks/useStore";
import { getFileTypeExtensionsAsString } from "@/common/helpers/uploadFileHelper";
import { FileType } from "@/common/types/prompt";
import { Edit } from "@mui/icons-material";
interface Props {
  questions: UpdatedQuestionTemplate[];
  answers: IAnswer[];
  onChange: (value: string | File, name: string, type: string) => void;
}

export const InputsForm = ({ questions, answers, onChange }: Props) => {
  const isGenerating = useAppSelector(state => state.template.isGenerating);
  const [codeFieldOpen, setCodeFieldOpen] = useState(false);

  return (
    <Stack gap={1}>
      {questions.map(question => {
        const value = answers.find(answer => answer.inputName === question.name)?.answer || "";
        return (
          <Stack
            direction={"row"}
            alignItems={"center"}
            gap={1}
          >
            <InputLabel
              sx={{
                fontSize: 14,
                fontWeight: 500,
                color: "primary.main",
              }}
            >
              {question.fullName} :
            </InputLabel>
            {question.type === "code" ? (
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
                    color: "primary.main",
                  }}
                >
                  {value ? "Edit Code" : "Insert Code"}
                </BaseButton>
                {codeFieldOpen && (
                  <CodeFieldModal
                    open
                    setOpen={setCodeFieldOpen}
                    value={value as string}
                    onSubmit={val => onChange(val, question.name, question.type)}
                  />
                )}
              </>
            ) : question.type === "choices" ? (
              <Select
                disabled={isGenerating}
                sx={{
                  ".MuiSelect-select": {
                    p: "3px 12px",
                    fontSize: 14,
                    fontWeight: 400,
                    opacity: value ? 1 : 0.7,
                  },
                  ".MuiOutlinedInput-notchedOutline": {
                    border: "1px solid",
                    borderRadius: "8px",
                    color: "primary.main",
                    borderColor: "inherit !important",
                    borderWidth: "1px !important",
                  },
                }}
                MenuProps={{
                  sx: { ".MuiMenuItem-root": { fontSize: 14, fontWeight: 400 } },
                }}
                value={value}
                onChange={e => onChange(e.target.value as string, question.name, question.type)}
                displayEmpty
              >
                <MenuItem
                  value=""
                  sx={{ opacity: 0.7 }}
                >
                  Select an option
                </MenuItem>
                {question.choices?.map(choice => (
                  <MenuItem
                    key={choice}
                    value={choice}
                    selected={value === choice}
                  >
                    {choice}
                  </MenuItem>
                ))}
              </Select>
            ) : question.type === "file" ? (
              <Stack
                direction={"row"}
                alignItems={"center"}
                gap={1}
                flex={1}
              >
                <Button
                  component="label"
                  variant="contained"
                  sx={{ border: "1px solid", borderColor: "", p: "3px 12px", fontSize: 14, fontWeight: 500 }}
                >
                  Upload file
                  <input
                    hidden
                    accept={getFileTypeExtensionsAsString(question.fileExtensions as FileType[])}
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
                        onChange(e.target.files[0], question.name, question.type);
                      }
                    }}
                  />
                </Button>
              </Stack>
            ) : (
              <TextField
                disabled={isGenerating}
                sx={{
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
                placeholder={question.required ? "Required" : "Optional"}
                type={question.type}
                value={value}
                onChange={e => onChange(e.target.value, question.name, question.type)}
              />
            )}
            <IconButton
              disabled={isGenerating}
              sx={{
                color: "grey.600",
                border: "none",
                p: "4px",
                ":hover": {
                  color: "primary.main",
                },
                visibility: value ? "visible" : "hidden",
              }}
              onClick={() => onChange("", question.name, question.type)}
            >
              <Edit />
            </IconButton>
          </Stack>
        );
      })}
    </Stack>
  );
};
