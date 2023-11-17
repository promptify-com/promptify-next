import React, { memo, useEffect, Dispatch, SetStateAction } from "react";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

import LogoAsAvatar from "@/assets/icons/LogoAvatar";
import { useAppSelector } from "@/hooks/useStore";
import { IMessage } from "@/common/types/chat";
import useTextSimulationStreaming from "@/hooks/useTextSimulationStreaming";
import { timeAgo } from "@/common/helpers/timeManipulation";

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
  const { fromUser, text, createdAt } = message;
  const currentUser = useAppSelector(state => state.user.currentUser);

  const name = fromUser ? currentUser?.first_name ?? currentUser?.username : "Promptify";

  return (
    <Grid
      py={"16px"}
      display={"flex"}
      gap={"16px"}
    >
      <Grid
        flex={1}
        display={"flex"}
        flexDirection={"column"}
        gap={"8px"}
        padding={" 8px 16px 8px 24px"}
        borderRadius={"0px 16px 16px 16px"}
        bgcolor={"surface.2"}
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
            color={"onSurface"}
          >
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
