import { memo, useEffect, Dispatch, SetStateAction, useState } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";

import { useAppSelector } from "@/hooks/useStore";
import { IMessage } from "@/common/types/chat";
import useTextSimulationStreaming from "@/hooks/useTextSimulationStreaming";
import { Bolt } from "@mui/icons-material";

interface MessageBlockProps {
  message: IMessage;
  setIsSimulaitonStreaming: Dispatch<SetStateAction<boolean>>;
  onScrollToBottom: () => void;
}

interface MessageContentProps {
  content: string;
  shouldStream: boolean;
  setIsSimulaitonStreaming: Dispatch<SetStateAction<boolean>>;
  onStreamingFinished: () => void;
}

const MessageContent = memo(
  ({ content, shouldStream, setIsSimulaitonStreaming, onStreamingFinished }: MessageContentProps) => {
    const { streamedText, hasFinished } = useTextSimulationStreaming({
      text: content,
      shouldStream,
    });

    useEffect(() => {
      if (hasFinished) {
        setIsSimulaitonStreaming(false);
        onStreamingFinished();
      }
    }, [hasFinished]);

    return <>{streamedText}</>;
  },
);

export const Message = ({ message, setIsSimulaitonStreaming, onScrollToBottom }: MessageBlockProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const { fromUser, text, createdAt, type } = message;
  const currentUser = useAppSelector(state => state.user.currentUser);

  const name = fromUser ? currentUser?.first_name ?? currentUser?.username : "Promptify";

  if (type === "form") return;

  return (
    <Grid
      py={"16px"}
      display={"flex"}
      flexDirection={"column"}
      gap={"16px"}
      position={"relative"}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <Typography
          sx={{
            position: "absolute",
            top: -2,
            opacity: 0.5,
            right: fromUser ? 0 : "",
            left: !fromUser ? 2 : "",
          }}
          fontSize={12}
          variant="caption"
        >
          {name} - {createdAt}
        </Typography>
      )}

      <Grid
        flex={1}
        display={"flex"}
        flexDirection={"column"}
        width={fromUser ? "content-fit" : "100%"}
        gap={"8px"}
        ml={"auto"}
        padding={" 8px 16px 8px 24px"}
        borderRadius={!fromUser ? "0px 16px 16px 16px" : "16px 16px 0px 16px"}
        bgcolor={fromUser ? "#7254721A" : "surface.2"}
      >
        <Grid
          display={"flex"}
          flexDirection={"column"}
          gap={"8px"}
          alignItems={"start"}
        >
          <Typography
            fontSize={15}
            lineHeight={"24px"}
            letterSpacing={"0.17px"}
            display={"flex"}
            alignItems={"center"}
            color={fromUser ? "#725472" : "onSurface"}
          >
            {text === "Run Prompt" && <Bolt />}
            <MessageContent
              content={text}
              shouldStream={!fromUser}
              setIsSimulaitonStreaming={setIsSimulaitonStreaming}
              onStreamingFinished={onScrollToBottom}
            />
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};
