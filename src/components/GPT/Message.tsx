import Typography from "@mui/material/Typography";
import type { IMessage } from "@/components/Prompt/Types/chat";
import MessageContainer from "./MessageContainer";
import { memo, useEffect, useState } from "react";
import { markdownToHTML, sanitizeHTML } from "@/common/helpers/htmlHelper";
import { ExecutionContent } from "../common/ExecutionContent";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import useTextSimulationStreaming from "@/hooks/useTextSimulationStreaming";
import { initialState as initialChatState, setIsSimulationStreaming } from "@/core/store/chatSlice";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";
import Done from "@mui/icons-material/Done";
import ContentCopy from "@mui/icons-material/ContentCopy";
import CustomTooltip from "@/components/Prompt/Common/CustomTooltip";
import Replay from "@mui/icons-material/Replay";
import MessageInputs from "./MessageInputs";
import { createMessage } from "../Chat/helper";
import { getWorkflowInputsValues } from "../GPTs/helpers";
import type { IWorkflowCreateResponse } from "../Automation/types";
import EditOutlined from "@mui/icons-material/EditOutlined";
import CreateNewFolderOutlined from "@mui/icons-material/CreateNewFolderOutlined";
import { setToast } from "@/core/store/toastSlice";

interface Props {
  message: IMessage;
  isInitialMessage?: boolean;
  retryExecution?(): void;
  showInputs?(): void;
  saveAsDocument?(): Promise<boolean>;
}

interface MessageContentProps {
  content: string;
  shouldStream: boolean;
  onStreamingFinished?: () => void;
}

export const MessageContentWithHTML = memo(({ content }: { content: string }) => {
  const [html, setHtml] = useState("");

  useEffect(() => {
    if (!content) {
      return;
    }

    const generateFinalHtml = async () => {
      const _html = await markdownToHTML(content);
      setHtml(_html);
    };

    generateFinalHtml();
  }, [content]);

  return <ExecutionContent content={sanitizeHTML(html)} />;
});

const MessageContent = memo(({ content, shouldStream, onStreamingFinished }: MessageContentProps) => {
  const dispatch = useAppDispatch();
  const { streamedText, hasFinished } = useTextSimulationStreaming({
    text: content,
    shouldStream,
  });

  useEffect(() => {
    if (hasFinished) {
      dispatch(setIsSimulationStreaming(false));

      onStreamingFinished?.();
    }
  }, [hasFinished]);

  return <>{streamedText}</>;
});

export default function Message({
  message,
  isInitialMessage = false,
  retryExecution,
  showInputs,
  saveAsDocument,
}: Props) {
  const { fromUser, isHighlight, type, text } = message;
  const dispatch = useAppDispatch();
  const [copyToClipboard, copyResult] = useCopyToClipboard();
  const [documentSaved, setSaveDocument] = useState(false);

  const gptGenerationStatus = useAppSelector(
    state => state.chat?.gptGenerationStatus ?? initialChatState.gptGenerationStatus,
  );

  const inputs = useAppSelector(store => store.chat?.inputs ?? initialChatState.inputs);
  const answers = type === "workflowExecution" ? getWorkflowInputsValues(message.data as IWorkflowCreateResponse) : [];

  const saveDocument = async () => {
    if (typeof saveAsDocument !== "function" || documentSaved) {
      return;
    }

    setSaveDocument(true);

    const saved = saveAsDocument();

    if (!saved) {
      setSaveDocument(false);
      dispatch(setToast({ message: "Document was not saved, please retry again.", severity: "warning" }));
      return;
    }
  };

  return (
    <Stack sx={{ gap: "24px" }}>
      {type === "workflowExecution" && inputs.length > 0 && (
        <MessageInputs
          message={createMessage({ type: "form", noHeader: true })}
          answers={answers}
          disabled
        />
      )}
      <MessageContainer message={message}>
        <Typography
          fontSize={14}
          fontWeight={500}
          color={"onSurface"}
          sx={{
            p: "16px 20px",
            borderRadius: fromUser
              ? "100px 100px 100px 0px"
              : isInitialMessage
                ? "0px 100px 100px 100px"
                : "0px 16px 16px 16px",
            bgcolor: isHighlight ? "#DFDAFF" : "#F8F7FF",
          }}
        >
          {["workflowExecution", "html"].includes(type) ? (
            <Stack
              width={"100%"}
              minHeight={"40px"}
            >
              <MessageContentWithHTML content={text} />
            </Stack>
          ) : (
            <MessageContent
              content={text}
              shouldStream={!fromUser}
            />
          )}
        </Typography>
        {type === "workflowExecution" && (
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            gap={2}
          >
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
              gap={2}
            >
              <CustomTooltip title={"Repeat"}>
                <IconButton
                  onClick={retryExecution}
                  disabled={["started", "streaming"].includes(gptGenerationStatus)}
                  sx={iconBtnStyle}
                >
                  <Replay />
                </IconButton>
              </CustomTooltip>
              {!!inputs.length && (
                <CustomTooltip title={"Edit"}>
                  <IconButton
                    onClick={showInputs}
                    disabled={["started", "streaming"].includes(gptGenerationStatus)}
                    sx={iconBtnStyle}
                  >
                    <EditOutlined />
                  </IconButton>
                </CustomTooltip>
              )}
              <CustomTooltip title={documentSaved ? "Document saved" : "Save as document"}>
                <IconButton
                  onClick={saveDocument}
                  disabled={["started", "streaming"].includes(gptGenerationStatus) || documentSaved}
                  sx={iconBtnStyle}
                >
                  <CreateNewFolderOutlined />
                </IconButton>
              </CustomTooltip>
            </Stack>
            <Button
              onClick={() => copyToClipboard(message.text)}
              startIcon={copyResult?.state === "success" ? <Done /> : <ContentCopy />}
              variant="text"
              sx={btnStyle}
            >
              Copy
            </Button>
          </Stack>
        )}
      </MessageContainer>
    </Stack>
  );
}

const btnStyle = {
  fontSize: 13,
  fontWeight: 500,
  color: "onSurface",
  p: "6px 24px",
  svg: {
    fontSize: 12,
  },
  "&:hover": {
    bgcolor: "action.hover",
    color: "onSurface",
  },
};

const iconBtnStyle = {
  ...btnStyle,
  border: "none",
  p: "6px",
  svg: {
    width: 22,
    height: 22,
  },
};
