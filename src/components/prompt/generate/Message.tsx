import React, { useState } from "react";
import { Avatar, Button, Grid, Typography } from "@mui/material";
import LogoAsAvatar from "@/assets/icons/LogoAvatar";
import { useAppSelector } from "@/hooks/useStore";
import { IMessage } from "./ChatBox";
import { ToggleButtonsGroup } from "@/components/design-system/ToggleButtonsGroup";

interface MessageBlockProps {
  message: IMessage;
  hideHeader?: boolean;
  onChangeValue?: (value: string) => void;
}

export const Message = ({ message, hideHeader, onChangeValue }: MessageBlockProps) => {
  const currentUser = useAppSelector(state => state.user.currentUser);

  const { fromUser, type, text, createdAt, choices } = message;

  const name = fromUser ? currentUser?.username : "Promptify";

  const [selectedChoice, setSelectedChoice] = useState("");

  const handleChange = (value: string) => {
    setSelectedChoice(value);
    if (onChangeValue) {
      onChangeValue(value);
    }
  };

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
      {message.fromUser && currentUser ? (
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
            {createdAt}
          </Typography>
        </Grid>
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
          >
            {text}
          </Typography>
          {type === "code" && !fromUser && (
            <Button
              variant="outlined"
              size="small"
              sx={{
                height: 30,
              }}
            >
              Upload your code
            </Button>
          )}
          {type === "choices" && choices && !fromUser && (
            <ToggleButtonsGroup
              variant="vertical"
              items={choices}
              value={selectedChoice}
              onChange={handleChange}
            />
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};
