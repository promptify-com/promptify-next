import { useRef } from "react";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import MessageSender from "./MessageSender";
import { ProgressLogo } from "@/components/common/ProgressLogo";

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
        {isValidating && (
          <Stack
            position={"absolute"}
            top={-30}
            direction={"row"}
            gap={2}
            alignItems={"center"}
          >
            <ProgressLogo size="small" />
            <Stack
              direction={"row"}
              gap={1}
            >
              <Typography
                fontSize={15}
                fontWeight={400}
                color={"onSurface"}
                sx={{ opacity: 0.6 }}
              >
                Promptify is thinking...
              </Typography>
            </Stack>
          </Stack>
        )}
      </Stack>

      <MessageSender
        onSubmit={onSubmit}
        disabled={disabled || disabledButton}
      />
    </Grid>
  );
};
