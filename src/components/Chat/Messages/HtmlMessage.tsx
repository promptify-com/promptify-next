import { memo, useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { timeAgo } from "@/common/helpers/timeManipulation";
import ClientOnly from "@/components/base/ClientOnly";
import { markdownToHTML, sanitizeHTML } from "@/common/helpers/htmlHelper";
import type { IMessage } from "@/components/Prompt/Types/chat";
import useTextSimulationStreaming from "@/hooks/useTextSimulationStreaming";
import { setIsSimulationStreaming } from "@/core/store/chatSlice";

interface MessageContentWithHTMLProps {
  content: string;
  shouldStream: boolean;
  onStreamingFinished: () => void;
}

const MessageContentWithHTML = memo(({ content, shouldStream, onStreamingFinished }: MessageContentWithHTMLProps) => {
  const dispatch = useAppDispatch();
  const { streamedText, hasFinished } = useTextSimulationStreaming({
    text: content,
    shouldStream,
  });
  const [html, setHtml] = useState("");

  useEffect(() => {
    const generateFinalHtml = async (text: string) => {
      const _html = await markdownToHTML(text);
      setHtml(sanitizeHTML(_html));
    };

    if (streamedText) {
      generateFinalHtml(streamedText);
    }

    if (hasFinished) {
      dispatch(setIsSimulationStreaming(false));
      onStreamingFinished();
    }
  }, [streamedText, hasFinished, dispatch, onStreamingFinished]);

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  );
});

interface Props {
  message: IMessage;
  shouldStream: boolean;
  onStreamingFinished: () => void;
}

const HtmlMessage = ({ message, shouldStream, onStreamingFinished }: Props) => {
  const [isHovered, setIsHovered] = useState(false);

  const { fromUser, text, createdAt } = message;
  const currentUser = useAppSelector(state => state.user.currentUser);

  const name = fromUser ? currentUser?.first_name ?? currentUser?.username : "Promptify";

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
              ...(!fromUser && { width: "100%" }),
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
        p={fromUser ? "16px 16px 16px 24px" : 0}
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
          <MessageContentWithHTML
            content={text}
            shouldStream={shouldStream && !fromUser}
            onStreamingFinished={onStreamingFinished}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default HtmlMessage;
