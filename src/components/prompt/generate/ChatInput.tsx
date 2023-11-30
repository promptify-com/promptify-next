import { useRef } from "react";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Add from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";

import MessageSender from "./MessageSender";
import { ProgressLogo } from "@/components/common/ProgressLogo";
import { useAppSelector } from "@/hooks/useStore";

interface ChatInputProps {
  onSubmit: (value: string) => void;
  disabled: boolean;
  isValidating: boolean;
  disabledButton: boolean;
  addNewPrompt: () => void;
}

export const ChatInput = ({ onSubmit, disabled, isValidating, disabledButton, addNewPrompt }: ChatInputProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mode = useAppSelector(state => state.template.accordionChatMode);

  return (
    <Grid
      ref={containerRef}
      position={"relative"}
      display={"flex"}
      width={"100%"}
      px={{ md: "40px" }}
      flexDirection={"column"}
      gap={"8px"}
    >
      <Stack
        direction={"row"}
        gap={2}
      >
        {isValidating && (
          <Stack
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

      <Stack
        direction={"row"}
        gap={"8px"}
        alignItems={"center"}
      >
        {mode === "execution" && (
          <Tooltip
            title="Add new Prompt"
            arrow
          >
            <Box
              onClick={addNewPrompt}
              sx={{
                padding: "4px",
                cursor: "pointer",
                width: "30px",
                height: "30px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "8px",
                bgcolor: "#375CA91A",
                color: "primary.main",
                transition: "all 0.3s ease-in-out",

                ":hover": {
                  bgcolor: "primary.main",
                  color: "white",
                  borderRadius: "99px",
                },
              }}
            >
              <Add
                sx={{
                  fontSize: 24,
                }}
              />
            </Box>
          </Tooltip>
        )}

        <Box flex={1}>
          <MessageSender
            onSubmit={onSubmit}
            disabled={disabled || disabledButton}
          />
        </Box>
      </Stack>
    </Grid>
  );
};
