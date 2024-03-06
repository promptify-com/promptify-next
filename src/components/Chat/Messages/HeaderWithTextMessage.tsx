import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import React from "react";
import MessageBoxHeader from "./MessageBoxHeader";

interface Props {
  content: string;
}

function HeaderWithTextMessage({ content }: Props) {
  return (
    <Stack
      direction={"column"}
      gap={2}
    >
      <MessageBoxHeader variant="FORM" />
      <Typography
        fontSize={16}
        lineHeight={"25.6px"}
        fontWeight={400}
        letterSpacing={"0.17px"}
        display={"flex"}
        alignItems={"center"}
        color={"onSurface"}
      >
        {content}
      </Typography>
    </Stack>
  );
}

export default HeaderWithTextMessage;
