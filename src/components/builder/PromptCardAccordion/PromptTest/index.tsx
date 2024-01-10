import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Close, ContentCopy, Done, PlayArrow } from "@mui/icons-material";
import { IEditPrompts } from "@/common/types/builder";
import usePromptExecute from "@/components/builder/Hooks/usePromptExecute";
import FormInput from "./FormInput";
import { IExecuteInput, IExecuteParam, IInputValue, IParamValue } from "@/components/builder/Types";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import useToken from "@/hooks/useToken";
import { parseMessageData } from "@/common/helpers/parseMessageData";
import FormParam from "./FormParam";
import { GeneratedContent } from "./GeneratedContent";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";
import useUploadPromptFiles from "@/hooks/useUploadPromptFiles";
import { useAppSelector } from "@/hooks/useStore";

interface PromptTestDialogProps {
  open: boolean;
  onClose: () => void;
  prompt: IEditPrompts;
}

export const PromptTestDialog: React.FC<PromptTestDialogProps> = ({ open, onClose, prompt }) => {
  const token = useToken();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingResponse, setGeneratingResponse] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);

  const inputsValues = useRef<IExecuteInput>({});
  const paramsValues = useRef<IExecuteParam[]>([]);

  const engines = useAppSelector(state => state.builder.engines);

  const [copyToClipboard, copyResult] = useCopyToClipboard();
  const { uploadedFiles, uploadPromptFiles } = useUploadPromptFiles();

  const handleClose = (e: {}, reason: "backdropClick" | "escapeKeyDown") => {
    if (reason && reason === "backdropClick") return;
    onClose();
  };

  const { prepareAndRemoveDuplicateInputs, preparePromptData } = usePromptExecute(prompt);

  const { inputs, params } = prepareAndRemoveDuplicateInputs();

  useEffect(() => {
    inputs.forEach(input => {
      inputsValues.current = {
        ...inputsValues.current,
        [input.name]: "",
      };
    });
    paramsValues.current = params.map(param => ({
      parameter: param.parameter_id,
      score: param.score,
    }));
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

  const uploadAndValidateFiles = async () => {
    const files = Object.entries(inputsValues.current)
      .filter(([_, input]) => input instanceof File)
      .map(([name, file]) => ({ name, file: file as File }));
    const filesUploaded = await uploadPromptFiles(files);

    if (!filesUploaded.status) {
      const invalids = filesUploaded.inputs
        .filter(input => input.error)
        .map(input => Object.entries(inputsValues.current).find(([name]) => input.name === name)?.[0]);

      setGeneratingResponse(`Please enter valid answers for "${invalids.join(", ")}"`);
      return;
    }
  };

  const runExecution = async () => {
    setGeneratingResponse("");
    setIsGenerating(true);

    await uploadAndValidateFiles();

    const executeData = preparePromptData(uploadedFiles.current, inputsValues.current, paramsValues.current);

    containerRef.current?.scrollIntoView({
      block: "end",
      behavior: "smooth",
    });

    fetchEventSource(`${process.env.NEXT_PUBLIC_API_URL}/api/meta/prompts/${prompt.id}/execute`, {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(executeData),
      openWhenHidden: true,
      async onopen(res) {
        if (res.ok && res.status === 200) {
          setIsGenerating(true);
        } else if (res.status >= 400 && res.status < 500 && res.status !== 429) {
          console.error("Client side error ", res);
        }
      },
      onmessage(msg) {
        try {
          const parseData = parseMessageData(msg.data);
          const message = parseData.message;

          if (message === "[CONNECTED]") {
            return;
          }

          if (msg.event === "infer" && msg.data) {
            if (message) {
              setGeneratingResponse(prev => prev.concat(message));
            }
          }
        } catch {
          console.info("invalid incoming msg:", msg);
        }
      },
      onerror(err) {
        setIsGenerating(false);
        throw err; // rethrow to stop the operation
      },
      onclose() {
        setIsGenerating(false);
      },
    });
  };

  const engineType = engines.find(engine => engine.id === prompt.engine_id)?.output_type ?? "TEXT";

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: "400px",
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
          ref={containerRef}
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
            disabled={isGenerating}
          >
            Run
          </Button>
          <Stack
            width={"100%"}
            gap={2}
          >
            <Stack
              direction={"row"}
              alignItems={"center"}
              gap={1}
            >
              <Typography
                fontSize={20}
                fontWeight={400}
              >
                Output
              </Typography>
              {isGenerating && (
                <CircularProgress
                  size={"20px"}
                  sx={{ color: "primary.light", p: "4px" }}
                />
              )}
            </Stack>
            <GeneratedContent
              content={generatingResponse}
              engineType={engineType}
              isGenerating={isGenerating}
            />
            <Button
              onClick={() => copyToClipboard(generatingResponse)}
              startIcon={copyResult?.state === "success" ? <Done /> : <ContentCopy />}
              sx={buttonStyle}
              disabled={!generatingResponse || isGenerating}
            >
              {copyResult?.state === "success" ? "Copied" : "Copy"}
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
