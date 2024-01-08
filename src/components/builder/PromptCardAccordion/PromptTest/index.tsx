import React, { useMemo, useRef, useState } from "react";
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
import { IExecuteInput, IExecuteParam, IInputValue, IParamValue } from "@/components/builder/Types";
import useToken from "@/hooks/useToken";
import { PromptLiveResponse } from "@/common/types/prompt";
import FormParam from "./FormParam";

interface PromptTestDialogProps {
  open: boolean;
  onClose: () => void;
  prompt: IEditPrompts;
}

export const PromptTestDialog: React.FC<PromptTestDialogProps> = ({ open, onClose, prompt }) => {
  const token = useToken();
  const inputsValues = useRef<IExecuteInput>({});
  const paramsValues = useRef<IExecuteParam[]>([]);
  const uploadedFiles = useRef(new Map<string, string>());
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingResponse, setGeneratingResponse] = useState<PromptLiveResponse | null>(null);

  const handleClose = (e: {}, reason: "backdropClick" | "escapeKeyDown") => {
    if (reason && reason === "backdropClick") return;
    onClose();
  };

  const { prepareAndRemoveDuplicateInputs, preparePromptData } = usePromptExecute(prompt);

  const [inputs, params] = useMemo(() => {
    const { inputs: _inputs, params: _params } = prepareAndRemoveDuplicateInputs();

    _inputs.forEach(input => {
      inputsValues.current = {
        ...inputsValues.current,
        [input.name]: "",
      };
    });
    _params.forEach(param => {
      paramsValues.current = paramsValues.current.concat({
        parameter: param.parameter_id,
        score: param.score,
      });
    });

    return [_inputs, _params];
  }, [prompt]);

  const updateInputsValues = (newInputVal: IInputValue) => {
    inputsValues.current = {
      ...inputsValues.current,
      [newInputVal.name]: newInputVal.value,
    };
  };

  const updateParamsValues = (newParamVal: IParamValue) => {
    paramsValues.current = paramsValues.current
      .filter(param => param.parameter !== newParamVal.parameter)
      .concat({
        parameter: newParamVal.parameter,
        score: newParamVal.score,
      });
  };

  const runExecution = () => {
    const executeData = preparePromptData(uploadedFiles.current, inputsValues.current, paramsValues.current);
    console.log(executeData);
  };

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
                  onChange={updateInputsValues}
                />
              );
            })}

            {params?.map(param => {
              return (
                <FormParam
                  key={param.parameter_id}
                  param={param}
                  onChange={updateParamsValues}
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
