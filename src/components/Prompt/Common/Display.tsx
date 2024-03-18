import { useRef } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useAppSelector } from "@/hooks/useStore";
import { ExecutionCard } from "./ExecutionCard";
import ParagraphPlaceholder from "@/components/placeholders/ParagraphPlaceholder";
import type { Templates, TemplatesExecutions } from "@/core/api/dto/templates";
import type { PromptLiveResponse } from "@/common/types/prompt";

interface Props {
  templateData: Templates;
  execution?: TemplatesExecutions | PromptLiveResponse;
  isLastExecution?: boolean;
}

export const Display: React.FC<Props> = ({ templateData, execution, isLastExecution }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedExecution = useAppSelector(state => state.executions.selectedExecution);
  const generatedExecution = useAppSelector(state => state.executions.generatedExecution);
  const isFetching = useAppSelector(state => state.executions.isFetching);

  const isGeneratedExecutionEmpty = Boolean(generatedExecution && !generatedExecution.data?.length);
  const executionIsLoading = (isFetching || isGeneratedExecutionEmpty) && isLastExecution;

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
            execution && (
              <ExecutionCard
                execution={execution}
                promptsData={templateData.prompts}
              />
            )
          )}
        </Box>
      </Box>
    </Grid>
  );
};
