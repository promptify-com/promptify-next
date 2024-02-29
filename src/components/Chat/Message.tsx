import { memo, useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import useTextSimulationStreaming from "@/hooks/useTextSimulationStreaming";
import { timeAgo } from "@/common/helpers/timeManipulation";
import { setIsSimulationStreaming } from "@/core/store/chatSlice";
import ClientOnly from "@/components/base/ClientOnly";
import { markdownToHTML, sanitizeHTML } from "@/common/helpers/htmlHelper";
import type { IMessage } from "@/components/Prompt/Types/chat";

interface Props {
  message: IMessage;
  onScrollToBottom: () => void;
  isExecutionShown?: boolean;
}

interface MessageContentProps {
  content: string;
  shouldStream: boolean;
  onStreamingFinished: () => void;
}

const MessageContent = memo(({ content, shouldStream, onStreamingFinished }: MessageContentProps) => {
  const dispatch = useAppDispatch();
  const { streamedText, hasFinished } = useTextSimulationStreaming({
    text: content,
    shouldStream,
  });

  useEffect(() => {
    if (hasFinished) {
      dispatch(setIsSimulationStreaming(false));

      onStreamingFinished();
    }
  }, [hasFinished]);

  return <>{streamedText}</>;
});

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
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: sanitizeHTML(html),
      }}
    />
  );
});

export const Message = ({ message, onScrollToBottom }: Props) => {
  const [isHovered, setIsHovered] = useState(false);

  const dispatch = useAppDispatch();

  const { fromUser, text, createdAt, type } = message;
  const currentUser = useAppSelector(state => state.user.currentUser);

  const name = fromUser ? currentUser?.first_name ?? currentUser?.username : "Promptify";

  useEffect(() => {
    if (fromUser || type === "html") return;
    dispatch(setIsSimulationStreaming(true));
  }, []);

  return (
    <Grid
      display={"flex"}
      flexDirection={"column"}
      gap={"16px"}
      position={"relative"}
      width={!fromUser ? "fit-content" : "100%"}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <ClientOnly>
          <Typography
            sx={{
              position: "absolute",
              top: -20,
              opacity: 0.5,
              right: fromUser ? 0 : "",
              left: !fromUser ? 2 : "",
            }}
            fontSize={12}
            variant="caption"
          >
            {name} {timeAgo(createdAt)}
          </Typography>
        </ClientOnly>
      )}

      <Grid
        flex={1}
        display={"flex"}
        flexDirection={"column"}
        width={fromUser ? "fit-content" : "100%"}
        gap={"8px"}
        padding={fromUser ? "16px 16px 16px 24px" : 0}
        borderRadius={"24px"}
        bgcolor={fromUser ? "primary.main" : "transparent"}
        ml={"auto"}
      >
        <Grid
          display={"flex"}
          flexDirection={"column"}
          gap={"8px"}
          alignItems={"start"}
        >
          {type === "html" ? (
            <MessageContentWithHTML content={text} />
          ) : (
            <Typography
              fontSize={16}
              lineHeight={"25.6px"}
              fontWeight={400}
              letterSpacing={"0.17px"}
              display={"flex"}
              alignItems={"center"}
              color={fromUser ? "onPrimary" : "onSurface"}
            >
              <MessageContent
                content={text}
                shouldStream={!fromUser}
                onStreamingFinished={onScrollToBottom}
              />
            </Typography>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};
