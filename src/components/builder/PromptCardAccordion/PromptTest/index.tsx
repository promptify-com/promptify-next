import React, { useMemo, useRef } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Close, ContentCopy, PlayArrow } from "@mui/icons-material";
import { IEditPrompts } from "@/common/types/builder";
import usePromptExecute from "../../Hooks/usePromptExecute";
import FormInput from "./FormInput";
import { IExecuteInput, IInputValue } from "../../Types";

interface PromptTestDialogProps {
  open: boolean;
  onClose: () => void;
  prompt: IEditPrompts;
}

export const PromptTestDialog: React.FC<PromptTestDialogProps> = ({ open, onClose, prompt }) => {
  const inputsValues = useRef<IExecuteInput>({});
  const uploadedFiles = useRef(new Map<string, string>());

  const handleClose = (e: {}, reason: "backdropClick" | "escapeKeyDown") => {
    if (reason && reason === "backdropClick") return;
    onClose();
  };

  const { prepareAndRemoveDuplicateInputs, preparePromptData } = usePromptExecute(prompt);

  const inputs = useMemo(() => {
    const { inputs: _inputs } = prepareAndRemoveDuplicateInputs();

    _inputs.forEach(input => {
      inputsValues.current = {
        ...inputsValues.current,
        [input.name]: "",
      };
    });

    return _inputs;
  }, [prompt]);

  const updateValues = (newInputVal: IInputValue) => {
    inputsValues.current = {
      ...inputsValues.current,
      [newInputVal.inputName]: newInputVal.value,
    };
  };

  const runExecution = () => {
    const executeData = preparePromptData(uploadedFiles.current, inputsValues.current);
    console.log(executeData);
  };

  console.log(inputsValues.current);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: "400px",
          textarea: {
            overscrollBehavior: "contain",
          },
        },
      }}
    >
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        p={"16px 24px"}
      >
        <DialogTitle
          sx={{
            fontSize: 20,
            fontWeight: 400,
            p: 0,
          }}
        >
          Test Now
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: "action.active",
            border: "none",
          }}
        >
          <Close />
        </IconButton>
      </Stack>
      <Divider />
      <DialogContent sx={{ p: 0 }}>
        <Stack
          gap={4}
          alignItems={"flex-end"}
          sx={{
            p: "16px 24px",
          }}
        >
          <Stack
            width={"100%"}
            gap={2}
          >
            <Typography
              fontSize={20}
              fontWeight={400}
            >
              Prompt inputs
            </Typography>
            {inputs.map((input, idx) => {
              return (
                <FormInput
                  key={idx}
                  input={input}
                  onChange={updateValues}
                />
              );
            })}
          </Stack>
          <Button
            onClick={runExecution}
            startIcon={<PlayArrow />}
            sx={buttonStyle}
          >
            Run
          </Button>
          <Stack
            width={"100%"}
            gap={2}
          >
            <Typography
              fontSize={20}
              fontWeight={400}
            >
              Output
            </Typography>
            <TextField
              multiline
              rows={15}
            />
            <Button
              startIcon={<ContentCopy />}
              sx={buttonStyle}
            >
              Copy
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

const buttonStyle = {
  width: "fit-content",
  ml: "auto",
  p: "6px 16px",
  border: "1px solid #1B1B1E1A",
  borderRadius: "4px",
  fontSize: 14,
  fontWeight: 500,
  color: "secondary.main",
};
