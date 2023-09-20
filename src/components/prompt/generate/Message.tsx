import React, { useState } from "react";
import { Avatar, Button, Grid, Typography } from "@mui/material";

import LogoAsAvatar from "@/assets/icons/LogoAvatar";
import { useAppSelector } from "@/hooks/useStore";
import { ToggleButtonsGroup } from "@/components/design-system/ToggleButtonsGroup";
import CodeFieldModal from "@/components/modals/CodeFieldModal";
import { IMessage } from "@/common/types/chat";

interface MessageBlockProps {
  message: IMessage;
  hideHeader?: boolean;
  onChangeValue?: (value: string) => void;
  disabledChoices: boolean;
}

export const Message = ({ message, hideHeader, onChangeValue, disabledChoices }: MessageBlockProps) => {
  const currentUser = useAppSelector(state => state.user.currentUser);

  const { fromUser, type, text, createdAt, choices } = message;

  const name = fromUser ? currentUser?.first_name ?? currentUser?.username : "Promptify";

  const [selectedValue, setSelectedValue] = useState("");
  const [codeFieldPopup, setCodeFieldPopup] = useState(false);

  const [codeUploaded, setCodeUploaded] = useState(false);

  const handleChange = (value: string) => {
    setSelectedValue(value);

    if (onChangeValue) {
      onChangeValue(value);
      setCodeUploaded(true);
    }
  };

  function getUploadStatusMessage() {
    if (codeUploaded) {
      return "Code uploaded";
    } else if (!codeUploaded && selectedValue !== "" && !codeFieldPopup) {
      return "Edit Your code";
    } else {
      return "Upload your code";
    }
  }

  const uploadBtnName = getUploadStatusMessage();

  return (
    <Grid
      p={"16px"}
      display={"flex"}
      gap={"16px"}
    >
      {!hideHeader && (
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
        ml={{ xs: hideHeader ? 6.5 : 0, md: hideHeader ? 7 : 0 }}
        mt={{ xs: hideHeader ? -2 : 0, md: hideHeader ? -2 : 0 }}
        display={"flex"}
        flexDirection={"column"}
        gap={"8px"}
      >
        {!hideHeader && (
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
          >
            {text}
          </Typography>
          {type === "code" && !fromUser && (
            <Button
              onClick={() => setCodeFieldPopup(true)}
              variant="outlined"
              disabled={codeUploaded}
              size="small"
              sx={{
                height: 30,
              }}
            >
              {uploadBtnName}
            </Button>
          )}
          {type === "choices" && choices && !fromUser && (
            <ToggleButtonsGroup
              variant="horizontal"
              items={choices}
              value={selectedValue}
              onChange={handleChange}
              disabled={disabledChoices || selectedValue !== ""}
            />
          )}
          <CodeFieldModal
            open={codeFieldPopup}
            setOpen={setCodeFieldPopup}
            value={selectedValue}
            onChange={setSelectedValue}
            onSubmit={handleChange}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};
