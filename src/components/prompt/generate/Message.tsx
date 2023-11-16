import React, { Dispatch, SetStateAction } from "react";
import { Avatar, Grid, Stack, Typography } from "@mui/material";
import { useAppSelector } from "@/hooks/useStore";
import { IMessage } from "@/common/types/chat";
import { timeAgo } from "@/common/helpers/timeManipulation";
import { StreamContent } from "./StreamContent";
import { CheckCircle } from "@mui/icons-material";
import { LogoApp } from "@/assets/icons/LogoApp";

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
          {message.type === "spark" ? (
            <Stack
              alignItems={"center"}
              justifyContent={"center"}
              sx={{ width: 32, height: 32, borderRadius: "50%", bgcolor: "primaryContainer" }}
            >
              <CheckCircle sx={{ color: "primary.main" }} />
            </Stack>
          ) : message.fromUser && currentUser ? (
            <Avatar
              src={currentUser.avatar}
              alt={currentUser.first_name}
              sx={{
                width: 32,
                height: 32,
                bgcolor: "surface.5",
              }}
            />
          ) : (
            <Stack
              alignItems={"center"}
              justifyContent={"center"}
              sx={{ width: 32, height: 32, borderRadius: "50%", bgcolor: "#000" }}
            >
              <LogoApp
                width={18}
                color="#fff"
              />
            </Stack>
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
            flexWrap={"wrap"}
            gap={"8px"}
          >
            <Typography
              fontSize={12}
              fontWeight={600}
              color={"onSurface"}
            >
              {name}
            </Typography>
            {message.type === "spark" && (
              <Typography
                fontSize={12}
                color={"text.secondary"}
                sx={{
                  opacity: 0.45,
                }}
              >
                Successfully done generation
              </Typography>
            )}
            <Typography
              fontSize={12}
              fontWeight={400}
              color={"onSurface"}
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
