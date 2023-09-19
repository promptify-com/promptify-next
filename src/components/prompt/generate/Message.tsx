import React, { useState } from "react";
import { Avatar, Button, Grid, Typography } from "@mui/material";
import LogoAsAvatar from "@/assets/icons/LogoAvatar";
import { useAppSelector } from "@/hooks/useStore";
import { IMessage } from "./ChatBox";
import { ToggleButtonsGroup } from "@/components/design-system/ToggleButtonsGroup";
import CodeFieldModal from "@/components/modals/CodeFieldModal";

interface MessageBlockProps {
  message: IMessage;
  hideHeader?: boolean;
  onChangeValue?: (value: string) => void;
}

export const Message = ({ message, hideHeader, onChangeValue }: MessageBlockProps) => {
  const currentUser = useAppSelector(state => state.user.currentUser);

  const { fromUser, type, text, createdAt, choices } = message;

  const name = fromUser ? currentUser?.username : "Promptify";

  const [selectedValue, setSelectedValue] = useState("");
  const [popup, setPopup] = useState(false);

  const handleChange = (value: string) => {
    setSelectedValue(value);

    if (onChangeValue) {
      onChangeValue(value);
    }
  };

  if (hideHeader) {
    // Render the message without the header (name and timestamp)
    return (
      <Grid
        ml={{ xs: 6.5, md: 9 }}
        mt={{ xs: -2, md: 0 }}
        p={{ xs: "16px", md: "0px" }}
      >
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
      gap={"16px"}
    >
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
              onClick={() => setPopup(true)}
              variant="outlined"
              size="small"
              sx={{
                height: 30,
              }}
            >
              {selectedValue !== "" ? "Edit your code" : "Upload your code"}
            </Button>
          )}
          {type === "choices" && choices && !fromUser && (
            <ToggleButtonsGroup
              variant="vertical"
              items={choices}
              value={selectedValue}
              onChange={handleChange}
            />
          )}
          <CodeFieldModal
            open={popup}
            setOpen={setPopup}
            value={selectedValue}
            onChange={setSelectedValue}
            onSubmit={handleChange}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};
