import React, { useRef } from "react";
import { DeleteOutline, PlayCircle } from "@mui/icons-material";
import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import { useAppSelector } from "@/hooks/useStore";
import ThreeDotsAnimation from "@/components/design-system/ThreeDotsAnimation";
import MessageSender from "./MessageSender";
import { useDispatch } from "react-redux";
import { setGeneratedExecution } from "@/core/store/executionsSlice";
import { setGeneratingStatus } from "@/core/store/templatesSlice";
import { GeneratingProgressCard } from "@/components/common/cards/GeneratingProgressCard";
import { ProgressLogo } from "@/components/common/ProgressLogo";

interface ChatInputProps {
  onSubmit: (value: string) => void;
  disabled: boolean;
  onClear: () => void;
  onGenerate: () => void;
  showGenerate: boolean;
  showClear: boolean;
  isValidating: boolean;
  disabledButton: boolean;
  abortGenerating: () => void;
}

export const ChatInput = ({
  onSubmit,
  disabled,
  onClear,
  onGenerate,
  showGenerate,
  showClear,
  isValidating,
  disabledButton,
  abortGenerating,
}: ChatInputProps) => {
  const dispatch = useDispatch();
  const isGenerating = useAppSelector(state => state.template.isGenerating);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const abortConnection = () => {
    abortGenerating();
    dispatch(setGeneratedExecution(null));
    dispatch(setGeneratingStatus(false));
  };

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
        {isGenerating ? (
          <Box
            width={"100%"}
            maxWidth={"360px"}
          >
            <GeneratingProgressCard onCancel={abortConnection} />
          </Box>
        ) : isValidating ? (
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
        ) : null}

        {/* <ThreeDotsAnimation loading={isValidating} /> */}
        {/* {showGenerate && !isGenerating && (
          <>
            <Button
              onClick={onGenerate}
              endIcon={<PlayCircle />}
              sx={{
                height: "22px",
                p: "15px",
                fontSize: 13,
                fontWeight: 500,
                ":hover": {
                  bgcolor: "action.hover",
                },
              }}
              variant="contained"
              disabled={isGenerating || isValidating || disabledButton}
            >
              Run prompt
            </Button>
            <Button
              variant="text"
              endIcon={<DeleteOutline />}
              sx={{
                height: "22px",
                p: "15px",
                fontSize: 13,
                fontWeight: 500,
                border: "1px solid",
                borderColor: "divider",
                color: "secondary.main",
                ":hover": {
                  bgcolor: "action.hover",
                },
              }}
              onClick={onClear}
            >
              Clear
            </Button>
          </>
        )}

        {isGenerating && <GeneratingProgressCard onCancel={abortConnection} />} */}
      </Stack>

      <MessageSender
        onSubmit={onSubmit}
        disabled={disabled}
      />
    </Grid>
  );
};
