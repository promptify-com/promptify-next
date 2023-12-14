import React, { useRef } from "react";
import { DeleteOutline, PlayCircle } from "@mui/icons-material";
import { Box, Button, Fade, Grid, Stack, Typography } from "@mui/material";
import { useAppSelector } from "@/hooks/useStore";
import MessageSender from "./MessageSender";
import { useDispatch } from "react-redux";
import { setGeneratedExecution } from "@/core/store/executionsSlice";
import { setGeneratingStatus } from "@/core/store/templatesSlice";
import { GeneratingProgressCard } from "@/components/common/cards/GeneratingProgressCard";
import { ProgressLogo } from "@/components/common/ProgressLogo";
import { isDesktopViewPort } from "@/common/helpers";
import { setAnswers } from "@/core/store/chatSlice";

interface ChatInputProps {
  onSubmit: (value: string) => void;
  disabled: boolean;
  onGenerate: () => void;
  showGenerate: boolean;
  isValidating: boolean;
  abortGenerating: () => void;
}

export const ChatInput = ({
  onSubmit,
  disabled,
  onGenerate,
  showGenerate,
  isValidating,
  abortGenerating,
}: ChatInputProps) => {
  const dispatch = useDispatch();
  const isGenerating = useAppSelector(state => state.template.isGenerating);
  const answers = useAppSelector(state => state.chat.answers);
  const isDesktopView = isDesktopViewPort();

  const selectedExecution = useAppSelector(state => state.executions.selectedExecution);
  const generatedExecution = useAppSelector(state => state.executions.generatedExecution);

  const isExecutionShown = Boolean(selectedExecution ?? generatedExecution);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const abortConnection = () => {
    abortGenerating();
    dispatch(setGeneratedExecution(null));
    dispatch(setGeneratingStatus(false));
  };

  return (
    <Grid
      ref={containerRef}
      mb={"16px"}
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
            maxWidth={!isExecutionShown ? "360px" : "100%"}
            mx={{ xs: "16px", md: !isExecutionShown ? "88px" : "32px" }}
          >
            <GeneratingProgressCard onCancel={abortConnection} />
          </Box>
        ) : isValidating ? (
          <Stack
            direction={"row"}
            gap={1}
            alignItems={"center"}
            ml={{ xs: "16px", md: "40px" }}
          >
            {!isExecutionShown && isDesktopView && <ProgressLogo size="small" />}
            <Stack
              direction={"row"}
              gap={1}
            >
              <Typography
                fontSize={12}
                fontWeight={600}
                color={"onSurface"}
              >
                Promptify
              </Typography>
              <Typography
                fontSize={12}
                fontWeight={500}
                color={"text.secondary"}
                sx={{ opacity: 0.45 }}
              >
                Thinking...
              </Typography>
            </Stack>
          </Stack>
        ) : (
          <Stack
            direction={"row"}
            alignItems={"center"}
            gap={2}
            flexWrap={"wrap"}
            mx={{ xs: "16px", md: !isExecutionShown ? "88px" : "32px" }}
          >
            {showGenerate && (
              <Fade
                in
                timeout={500}
              >
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
                  disabled={isGenerating || isValidating}
                >
                  Run prompt
                </Button>
              </Fade>
            )}
            {!!answers.length && (
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
                onClick={() => dispatch(setAnswers([]))}
              >
                Clear
              </Button>
            )}
          </Stack>
        )}
      </Stack>

      <MessageSender
        onSubmit={onSubmit}
        disabled={disabled}
        showGenerate={showGenerate}
        onGenerate={onGenerate}
      />
    </Grid>
  );
};
