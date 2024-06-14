import Typography from "@mui/material/Typography";
import type { IMessage } from "@/components/Prompt/Types/chat";
import MessageContainer from "./MessageContainer";
import { memo, useEffect, useState } from "react";
import { markdownToHTML, sanitizeHTML } from "@/common/helpers/htmlHelper";
import { ExecutionContent } from "../common/ExecutionContent";
import { useAppDispatch } from "@/hooks/useStore";
import useTextSimulationStreaming from "@/hooks/useTextSimulationStreaming";
import { setIsSimulationStreaming } from "@/core/store/chatSlice";
import { Button, Stack } from "@mui/material";
import useCopyToClipboard from "../../hooks/useCopyToClipboard";
import Done from "@mui/icons-material/Done";
import ContentCopy from "@mui/icons-material/ContentCopy";

interface Props {
  message: IMessage;
  isInitialMessage?: boolean;
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

export default function Message({ message, isInitialMessage = false }: Props) {
  const { fromUser, isHighlight, type, text } = message;
  const [copyToClipboard, copyResult] = useCopyToClipboard();

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
          gap={2}
        >
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
  },
};
