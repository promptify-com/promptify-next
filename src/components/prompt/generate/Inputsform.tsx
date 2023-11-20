import React, { useState } from "react";
import { IAnswer } from "@/common/types/chat";
import { UpdatedQuestionTemplate } from "@/core/api/dto/templates";
import BaseButton from "@/components/base/BaseButton";
import CodeFieldModal from "@/components/modals/CodeFieldModal";
import { useAppSelector } from "@/hooks/useStore";
import { getFileTypeExtensionsAsString } from "@/common/helpers/uploadFileHelper";
import { FileType } from "@/common/types/prompt";
import {
  DeleteOutline,
  Edit,
  ExpandMore,
  HelpOutline,
  InfoOutlined,
  PlayCircle,
  UnfoldLess,
} from "@mui/icons-material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import AccordionDetails from "@mui/material/AccordionDetails";
import Box from "@mui/material/Box";
import Add from "@mui/icons-material/Add";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
interface Props {
  questions: UpdatedQuestionTemplate[];
  answers: IAnswer[];
  onChange: (value: string | File, question: UpdatedQuestionTemplate) => void;
  onGenerate: () => void;
}

export const InputsForm = ({ questions, answers, onChange, onGenerate }: Props) => {
  const isGenerating = useAppSelector(state => state.template.isGenerating);
  const [codeFieldOpen, setCodeFieldOpen] = useState(false);

  const [expanded, setExpanded] = useState(true);

  const handleExpandChange = (isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

  return (
    <Accordion
      elevation={0}
      expanded={expanded}
      onChange={(_e, isExpanded) => handleExpandChange(isExpanded)}
    >
      <AccordionSummary
        sx={{
          mb: -2,
          bgcolor: "surface.2",
          borderRadius: "0px 16px 16px 16px",
        }}
      >
        <Stack
          direction={"row"}
          gap={"8px"}
          width={"100%"}
          alignItems={"center"}
        >
          <Box
            position={"relative"}
            mt={0.5}
            sx={{
              padding: "4px",
              width: "40px",
              height: "40px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "8px",
              border: "1px dashed #375CA9 ",
              bgcolor: "#375CA91A",
              color: "#375CA9",
            }}
          >
            <Add
              sx={{
                fontSize: 32,
              }}
            />
            <Box
              position={"absolute"}
              width={"13px"}
              height={"13px"}
              borderRadius={"4px 0px 8px 0px"}
              bgcolor={"surface.1"}
              bottom={0}
              right={0}
            />
          </Box>
          <Stack
            flex={1}
            direction={"column"}
            gap={"2px"}
          >
            <Typography
              fontSize={"15px"}
              lineHeight={"120%"}
              letterSpacing={"0.2px"}
            >
              New prompt
            </Typography>
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 400,
                lineHeight: "143%",
                letterSpacing: "0.17px",
                opacity: 0.7,
              }}
            >
              About 360s generation time
            </Typography>
          </Stack>

          <Stack
            direction={"row"}
            alignItems={"center"}
          >
            {expanded && (
              <Button
                onClick={onGenerate}
                endIcon={<PlayCircle />}
                sx={{
                  height: "22px",
                  p: "15px",
                  fontSize: 13,
                  fontWeight: 500,
                  ":hover": {
                    bgcolor: "action.hover",
                  },
                }}
                variant="contained"
              >
                Run prompt
              </Button>
            )}
          </Stack>
          <Stack>
            {expanded ? (
              <Box sx={{ p: 1 }}>
                <UnfoldLess
                  sx={{
                    fontSize: 20,
                  }}
                />
              </Box>
            ) : (
              <Button
                sx={{
                  mr: -1.5,
                  color: "onSurface",
                }}
              >
                Expand
                <UnfoldLess
                  sx={{
                    fontSize: 20,
                    ml: 1,
                  }}
                />
              </Button>
            )}
          </Stack>
        </Stack>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          pt: "32px",
          bgcolor: "surface.2",
          borderRadius: "0px 16px 16px 16px",
        }}
      >
        <Stack>
          <Typography
            borderRadius={"8px"}
            bgcolor={"#375CA9"}
            p={"10px 8px 16px 16px"}
            color={"white"}
            lineHeight={"100%"}
            letterSpacing={"1px"}
            fontSize={"10px"}
            textTransform={"uppercase"}
          >
            PROMPT Template information
          </Typography>
          <Stack
            mt={-1}
            bgcolor={"surface.1"}
            borderRadius={"8px"}
          >
            <Stack gap={1}>
              {questions.map(question => {
                const value = answers.find(answer => answer.inputName === question.name)?.answer || "";
                const isFile = value instanceof File;
                return (
                  <Stack
                    key={question.name}
                    direction={"row"}
                    p={"6px"}
                    alignItems={"center"}
                    gap={1}
                  >
                    <Radio
                      size="small"
                      checked={!!value}
                      value="a"
                      name="radio-buttons"
                      inputProps={{ "aria-label": "A" }}
                    />
                    <InputLabel
                      sx={{
                        fontSize: 15,
                        fontWeight: 500,
                        color: "primary.main",
                      }}
                    >
                      {question.fullName} {question.required && <span>*</span>} :
                    </InputLabel>
                    <Stack flex={1}>
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
                              borderColor: "secondary.main",
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
                              onSubmit={val => onChange(val, question)}
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
                            ".MuiOutlinedInput-notchedOutline, .Mui-focused": {
                              borderRadius: "8px",
                              borderWidth: "1px !important",
                              borderColor: "secondary.main",
                            },
                          }}
                          MenuProps={{
                            sx: { ".MuiMenuItem-root": { fontSize: 14, fontWeight: 400 } },
                          }}
                          value={value}
                          onChange={e => onChange(e.target.value as string, question)}
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
                        >
                          <Button
                            component="label"
                            variant="contained"
                            sx={{ border: "1px solid", p: "3px 12px", fontSize: 14, fontWeight: 500 }}
                          >
                            {isFile ? value.name : "Upload file"}
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
                                  onChange(e.target.files[0], question);
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
                          placeholder={"Type here"}
                          type={question.type}
                          value={value}
                          onChange={e => onChange(e.target.value, question)}
                        />
                      )}
                    </Stack>
                    <Stack
                      direction={"row"}
                      alignItems={"center"}
                      gap={"8px"}
                    >
                      {question.required && (
                        <Typography
                          sx={{
                            fontSize: 15,
                            fontWeight: 400,
                            lineHeight: "100%",
                            opacity: 0.3,
                          }}
                        >
                          Required
                        </Typography>
                      )}
                      <IconButton
                        sx={{
                          opacity: 0.3,
                          border: "none",
                        }}
                      >
                        <HelpOutline />
                      </IconButton>
                    </Stack>
                    {/* {!["file", "code", "choices"].includes(question.type) && (
                      <Edit
                        sx={{
                          fontSize: 16,
                          color: "primary.main",
                          border: "none",
                          p: "4px",
                          opacity: !value ? 0.5 : 1,
                        }}
                      />
                    )} */}
                  </Stack>
                );
              })}
            </Stack>
          </Stack>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};
