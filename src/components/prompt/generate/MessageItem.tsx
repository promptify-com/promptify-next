import React from "react";
import { Avatar, Grid, Typography } from "@mui/material";
import LogoAsAvatar from "@/assets/icons/LogoAvatar";
import { useAppSelector } from "@/hooks/useStore";

interface MessageBlockProps {
  isUser: boolean;
  text: string;
  timestamp: string;
  hideHeader?: boolean;
}

const MessageBlock = ({ isUser, text, timestamp, hideHeader }: MessageBlockProps) => {
  const currentUser = useAppSelector(state => state.user.currentUser);
  const name = isUser ? currentUser?.username : "Promptify";

  if (hideHeader) {
    // Render the message without the header (name and timestamp)
    return (
      <Grid ml={9}>
        <Typography
          fontSize={15}
          lineHeight={"24px"}
          letterSpacing={"0.17px"}
        >
          {text}
        </Typography>
      </Grid>
    );
  }

  return (
    <Grid
      p={"16px"}
      display={"flex"}
      flexDirection={{ xs: "column", md: "row" }}
      gap={"16px"}
    >
      {isUser && currentUser ? (
        <Avatar
          src={currentUser.avatar}
          alt={currentUser.first_name}
          sx={{
            display: { xs: "none", md: "flex" },
            width: 40,
            height: 40,
            bgcolor: "surface.5",
          }}
        />
      ) : (
        <LogoAsAvatar />
      )}
      <Grid
        flex={1}
        display={"flex"}
        flexDirection={"column"}
        gap={"8px"}
      >
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
            {timestamp}
          </Typography>
        </Grid>
        <Grid>
          <Typography
            fontSize={15}
            lineHeight={"24px"}
            letterSpacing={"0.17px"}
          >
            {text}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default MessageBlock;
