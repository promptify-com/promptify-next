import { useEffect, useRef, useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import { ExecutionCard } from "./ExecutionCard";
import ParagraphPlaceholder from "@/components/placeholders/ParagraphPlaceholder";
import { isDesktopViewPort } from "@/common/helpers";
import ExecutionFooter from "./ExecutionFooter";
import { useAppSelector } from "@/hooks/useStore";
import type { Templates } from "@/core/api/dto/templates";
import type { IAnswer } from "@/common/types/chat";

interface Props {
  templateData: Templates;
  close?: () => void;
  answers?: IAnswer[];
}

export const Display: React.FC<Props> = ({ templateData, close, answers }) => {
  const [firstLoad, setFirstLoad] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDesktopView = isDesktopViewPort();
  const selectedExecution = useAppSelector(state => state.executions.selectedExecution);
  const generatedExecution = useAppSelector(state => state.executions.generatedExecution);
  const isFetching = useAppSelector(state => state.executions.isFetching);

  const isGeneratedExecutionEmpty = Boolean(generatedExecution && !generatedExecution.data?.length);
  const executionIsLoading = isFetching || isGeneratedExecutionEmpty;

  // click listener to remove opacity layer on first loaded execution
  useEffect(() => {
    const handleClick = () => setFirstLoad(false);

    const container = containerRef.current;
    container?.addEventListener("click", handleClick);

    return () => container?.removeEventListener("click", handleClick);
  }, []);

  const currentGeneratedPrompt = useMemo(() => {
    if (generatedExecution?.data?.length) {
      const loadingPrompt = generatedExecution.data.find(prompt => prompt.isLoading);
      const prompt = templateData.prompts.find(prompt => prompt.id === loadingPrompt?.prompt);
      if (prompt) return prompt;
    }

    return null;
  }, [generatedExecution]);

  return (
    <Grid
      display={"flex"}
      flexDirection={"column"}
      gap={"8px"}
      position={"relative"}
    >
      <Box
        ref={containerRef}
        sx={{
          bgcolor: "transparent",
          position: "relative",
        }}
      >
        <Box
          sx={{
            overflow: "auto",
            bgcolor: "surface.1",
            borderRadius: "16px 16px 0px 0px",
            position: "relative",
          }}
        >
          {executionIsLoading ? (
            <ParagraphPlaceholder count={2} />
          ) : !selectedExecution && isGeneratedExecutionEmpty ? (
            <Typography
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
              }}
            >
              No spark found
            </Typography>
          ) : (
            <ExecutionCard
              execution={generatedExecution ?? selectedExecution}
              promptsData={templateData.prompts}
              answers={answers}
            />
          )}
        </Box>
      </Box>
      {currentGeneratedPrompt && (
        <ExecutionFooter
          title={currentGeneratedPrompt.title}
          order={currentGeneratedPrompt.order}
          isMobile={!isDesktopView}
        />
      )}
    </Grid>
  );
};
