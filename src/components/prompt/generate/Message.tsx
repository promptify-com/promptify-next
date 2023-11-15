import React, { Dispatch, SetStateAction } from "react";
import { Avatar, Grid, Typography } from "@mui/material";
import LogoAsAvatar from "@/assets/icons/LogoAvatar";
import { useAppSelector } from "@/hooks/useStore";
import { IMessage } from "@/common/types/chat";
import { timeAgo } from "@/common/helpers/timeManipulation";
import { StreamContent } from "./StreamContent";

interface MessageBlockProps {
  message: IMessage;
  setIsSimulationStreaming: Dispatch<SetStateAction<boolean>>;
  onScrollToBottom: () => void;
}

export const Message = ({ message, setIsSimulationStreaming, onScrollToBottom }: MessageBlockProps) => {
  const { fromUser, text, createdAt } = message;
  const currentUser = useAppSelector(state => state.user.currentUser);

  const name = fromUser ? currentUser?.first_name ?? currentUser?.username : "Promptify";

  return (
    <Grid
      py={"16px"}
      display={"flex"}
      gap={"16px"}
    >
      {!message.noHeader && (
        <>
          {message.fromUser && currentUser ? (
            <Avatar
              src={currentUser.avatar}
              alt={currentUser.first_name}
              sx={{
                width: 40,
                height: 40,
                bgcolor: "surface.5",
              }}
            />
          ) : (
            <LogoAsAvatar />
          )}
        </>
      )}

      <Grid
        flex={1}
        ml={{ xs: message.noHeader ? 6.5 : 0, md: message.noHeader ? 7 : 0 }}
        mt={{ xs: message.noHeader ? -1.5 : 0, md: message.noHeader ? -1.5 : 0 }}
        display={"flex"}
        flexDirection={"column"}
        gap={"8px"}
      >
        {!message.noHeader && (
          <Grid
            display={"flex"}
            alignItems={"center"}
            gap={"8px"}
          >
            <Typography
              fontSize={12}
              lineHeight={"17.16px"}
            >
              {name}
            </Typography>
            <Typography
              fontSize={12}
              lineHeight={"17.16px"}
              sx={{
                opacity: 0.5,
              }}
            >
              {timeAgo(createdAt)}
            </Typography>
          </Grid>
        )}

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
            <StreamContent
              content={text}
              shouldStream={!fromUser}
              setIsSimulationStreaming={setIsSimulationStreaming}
              onStreamingFinished={onScrollToBottom}
            />
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};
