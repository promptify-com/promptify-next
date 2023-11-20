import { useRef } from "react";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";

import ThreeDotsAnimation from "@/components/design-system/ThreeDotsAnimation";
import MessageSender from "./MessageSender";

interface ChatInputProps {
  onSubmit: (value: string) => void;
  disabled: boolean;
  isValidating: boolean;
  disabledButton: boolean;
}

export const ChatInput = ({ onSubmit, disabled, isValidating, disabledButton }: ChatInputProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <Grid
      ref={containerRef}
      position={"relative"}
      display={"flex"}
      flexDirection={"column"}
      gap={"8px"}
    >
      <Stack
        direction={"row"}
        gap={2}
      >
        <ThreeDotsAnimation loading={isValidating} />
      </Stack>

      <MessageSender
        onSubmit={onSubmit}
        disabled={disabled || disabledButton}
      />
    </Grid>
  );
};
