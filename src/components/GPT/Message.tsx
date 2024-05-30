import Typography from "@mui/material/Typography";
import { IMessage } from "@/components/Prompt/Types/chat";
import MessageContainer from "./MessageContainer";
import { memo, useEffect, useState } from "react";
import { markdownToHTML, sanitizeHTML } from "@/common/helpers/htmlHelper";
import { ExecutionContent } from "../common/ExecutionContent";
import { useAppDispatch } from "@/hooks/useStore";
import useTextSimulationStreaming from "@/hooks/useTextSimulationStreaming";
import { setIsSimulationStreaming } from "@/core/store/chatSlice";
import { Stack } from "@mui/material";

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

  return (
    <MessageContainer message={message}>
      <Typography
        fontSize={14}
        fontWeight={500}
        color={"onSurface"}
        sx={{
          p: "16px 20px",
          width: "100%",
          borderRadius: fromUser
            ? "100px 100px 100px 0px"
            : isInitialMessage
            ? "0px 100px 100px 100px"
            : "0px 16px 16px 16px",
          bgcolor: isHighlight ? "#DFDAFF" : "#F8F7FF",
        }}
      >
        {type === "html" ? (
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
    </MessageContainer>
  );
}
