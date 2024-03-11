import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import React from "react";
import RunButton from "../RunButton";

interface Props {
  content: string;
  onGenerate: () => void;
}

function ReadyMessage({ content, onGenerate }: Props) {
  return (
    <Stack
      alignItems={"start"}
      gap={4}
    >
      <Typography
        fontSize={24}
        lineHeight={"25.6px"}
        fontWeight={400}
        letterSpacing={"0.17px"}
        display={"flex"}
        alignItems={"center"}
        color={"onSurface"}
      >
        {content}
      </Typography>
      <RunButton onClick={onGenerate} />
    </Stack>
  );
}

export default ReadyMessage;
