import Typography from "@mui/material/Typography";
import type { IMessage } from "@/components/Prompt/Types/chat";
import MessageContainer from "./MessageContainer";
import { memo, useEffect, useState } from "react";
import { markdownToHTML, sanitizeHTML } from "@/common/helpers/htmlHelper";
import { ExecutionContent } from "../common/ExecutionContent";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import useTextSimulationStreaming from "@/hooks/useTextSimulationStreaming";
import { setAnswers, setIsSimulationStreaming } from "@/core/store/chatSlice";
import { Button, IconButton, Stack } from "@mui/material";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";
import Done from "@mui/icons-material/Done";
import ContentCopy from "@mui/icons-material/ContentCopy";
import CustomTooltip from "@/components/Prompt/Common/CustomTooltip";
import Replay from "@mui/icons-material/Replay";
import EditOutlined from "@mui/icons-material/EditOutlined";
import { IWorkflowCreateResponse } from "@/components/Automation/types";
import { kwargsToAnswers } from "@/components/GPTs/helpers";

interface Props {
  message: IMessage;
  isInitialMessage?: boolean;
  retryExecution?(): void;
  showInputs?(): void;
}

interface MessageContentProps {
  content: string;
  shouldStream: boolean;
  onStreamingFinished?: () => void;
}

const MessageContentWithHTML = memo(({ content }: { content: string }) => {
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

export default function Message({ message, isInitialMessage = false, retryExecution, showInputs }: Props) {
  const dispatch = useAppDispatch();
  const { fromUser, isHighlight, type, text } = message;
  const [copyToClipboard, copyResult] = useCopyToClipboard();

  const isGenerating = useAppSelector(state => state.templates?.isGenerating ?? false);
  const inputs = useAppSelector(store => store.chat?.inputs ?? []);

  const editInputs = () => {
    const workflowData = message.data as IWorkflowCreateResponse;
    const kwargs = workflowData.periodic_task?.kwargs;
    dispatch(setAnswers(kwargsToAnswers(kwargs ?? "")));
    showInputs?.();
  };

  return (
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
                disabled={isGenerating}
                sx={iconBtnStyle}
              >
                <Replay />
              </IconButton>
            </CustomTooltip>
            {!!inputs.length && (
              <CustomTooltip title={"Edit"}>
                <IconButton
                  onClick={editInputs}
                  disabled={isGenerating}
                  sx={iconBtnStyle}
                >
                  <EditOutlined />
                </IconButton>
              </CustomTooltip>
            )}
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
