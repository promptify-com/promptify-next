import React, { Dispatch, SetStateAction } from "react";
import { Avatar, Grid, Stack, Typography } from "@mui/material";
import { useAppSelector } from "@/hooks/useStore";
import { IMessage } from "@/common/types/chat";
import { timeAgo } from "@/common/helpers/timeManipulation";
import { StreamContent } from "./StreamContent";
import { CheckCircle } from "@mui/icons-material";
import { LogoApp } from "@/assets/icons/LogoApp";
import { isDesktopViewPort } from "@/common/helpers";

interface MessageBlockProps {
  message: IMessage;
  setIsSimulationStreaming: Dispatch<SetStateAction<boolean>>;
  onScrollToBottom: () => void;
}

export const Message = ({ message, setIsSimulationStreaming, onScrollToBottom }: MessageBlockProps) => {
  const { fromUser, text, createdAt } = message;
  const currentUser = useAppSelector(state => state.user.currentUser);
  const isChatFullScreen = useAppSelector(state => state.template.isChatFullScreen);
  const isDesktopView = isDesktopViewPort();

  const name = fromUser ? currentUser?.first_name ?? currentUser?.username : "Promptify";

  return (
    <Grid
      py={{ xs: "8px", md: "16px" }}
      display={"flex"}
      gap={"16px"}
    >
      {isChatFullScreen && !message.noHeader && isDesktopView && (
        <>
          {message.type === "spark" ? (
            <Stack
              alignItems={"center"}
              justifyContent={"center"}
              sx={{ width: 32, height: 32, borderRadius: "50%", bgcolor: "#375CA91F" }}
            >
              <CheckCircle sx={{ color: "#375CA9" }} />
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
        ml={{ xs: 0, md: isChatFullScreen && message.noHeader ? "48px" : 0 }}
        mt={{ xs: 0, md: message.noHeader ? -1.5 : 0 }}
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
            fontSize={14}
            fontWeight={400}
            letterSpacing={"0.17px"}
            lineHeight={"160%"}
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
