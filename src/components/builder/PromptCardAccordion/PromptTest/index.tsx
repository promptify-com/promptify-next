import React, { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Close from "@mui/icons-material/Close";
import ContentCopy from "@mui/icons-material/ContentCopy";
import Done from "@mui/icons-material/Done";
import PlayArrow from "@mui/icons-material/PlayArrow";
import { IEditPrompts } from "@/common/types/builder";
import usePromptExecute from "@/components/builder/Hooks/usePromptExecute";
import FormInput from "./FormInput";
import { IExecuteInput, IExecuteParam, InputValue, ParamValue } from "@/components/builder/Types";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import useToken from "@/hooks/useToken";
import { parseMessageData } from "@/common/helpers/parseMessageData";
import FormParam from "./FormParam";
import GeneratedContent from "./GeneratedContent";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";
import useUploadPromptFiles from "@/hooks/useUploadPromptFiles";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { templatesApi } from "@/core/api/templates";
import { randomId } from "@/common/helpers";
import { initialState } from "@/core/store/builderSlice";

interface PromptTestDialogProps {
  open: boolean;
  onClose: () => void;
  prompt: IEditPrompts;
}

function PromptTestDialog({ open, onClose, prompt }: PromptTestDialogProps) {
  const token = useToken();
  const dispatch = useAppDispatch();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingResponse, setGeneratingResponse] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);

  const inputsValues = useRef<IExecuteInput>({});
  const paramsValues = useRef<IExecuteParam[]>([]);

  const currentUser = useAppSelector(state => state.user.currentUser);
  const template = useAppSelector(state => state.builder?.template ?? null);
  const engines = useAppSelector(state => state.builder?.engines ?? initialState.engines);
  const engine = engines.find(engine => engine.id === prompt.engine);

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

  const updateInputsValues = (newInputVal: InputValue) => {
    inputsValues.current = {
      ...inputsValues.current,
      [newInputVal.name]: newInputVal.value,
    };
  };

  const updateParamsValues = (newParamVal: ParamValue) => {
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
    const status = filesUploaded.status;

    if (!status) {
      const invalids = filesUploaded.inputs
        .filter(input => input.error)
        .map(input => Object.entries(inputsValues.current).find(([name]) => input.name === name)?.[0]);

      setGeneratingResponse(`Please enter valid answers for "${invalids.join(", ")}"`);
    }

    return status;
  };

  const dispatchNewExecution = (output: string) => {
    dispatch(
      templatesApi.util.updateQueryData("getPromptExecutions", template?.id!, _executions => {
        _executions.unshift({
          id: randomId(),
          output,
          prompt: {
            id: prompt.id!,
            title: prompt.title!,
            engine: engine!,
          },
          executed_by: currentUser?.id,
          created_at: new Date(new Date().getTime() - 1000),
          tokens_spent: 360,
        });
        return _executions;
      }),
    );
  };

  const runExecution = async () => {
    setGeneratingResponse("");
    setIsGenerating(true);

    const upload = await uploadAndValidateFiles();
    if (!upload) {
      setIsGenerating(false);
      return;
    }

    const executeData = preparePromptData(uploadedFiles.current, inputsValues.current, paramsValues.current);

    containerRef.current?.scrollIntoView({
      block: "end",
      behavior: "smooth",
    });

    let output = "";
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
        if (res.status >= 400 && res.status < 500 && res.status !== 429) {
          console.error("Client side error ", res);
          setGeneratingResponse("Please enter valid answers");
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
              output += message;
              setGeneratingResponse(prev => prev.concat(message));
            }
          }

          if (message === "[COMPLETED]") {
            dispatchNewExecution(output);
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

  const engineType = engine?.output_type ?? "TEXT";
  const showFormParams = inputs.length > 0 || params.length > 0;

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
          {showFormParams && (
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
          )}
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
}

const buttonStyle = {
  width: "fit-content",
  ml: "auto",
  p: "6px 16px",
  border: "1px solid #1B1B1E1A",
  borderRadius: "4px",
  fontSize: 14,
  fontWeight: 500,
  color: "secondary.main",
  ":hover": {
    bgcolor: "surfaceContainer",
  },
};

export default PromptTestDialog;
