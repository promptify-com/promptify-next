import React, { useState } from "react";
import {
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import { Templates, TemplatesExecutions } from "@/core/api/dto/templates";
import { ExecutionCard } from "./ExecutionCard";
import { PromptLiveResponse } from "@/common/types/prompt";
import { ExecutionCardGenerated } from "./ExecutionCardGenerated";
import { ExecutionsHeader } from "./ExecutionsHeader";

interface Props {
  templateData: Templates;
  executions: TemplatesExecutions[];
  isFetching?: boolean;
  newExecutionData: PromptLiveResponse | null;
  refetchExecutions: () => void;
}

export const Executions: React.FC<Props> = ({
  templateData,
  executions,
  isFetching,
  newExecutionData,
  refetchExecutions,
}) => {

  const allExecutions = executions
    .slice()
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

  return (
    <Box sx={{ position: "relative" }}>

      <ExecutionsHeader 
        executions={executions}
      />

      <Box sx={{ mx: { xs: 0, md: "15px" } }}>
        {newExecutionData && (
          <ExecutionCardGenerated
            execution={newExecutionData}
            templateData={templateData}
          />
        )}

        {isFetching ? (
          <Box
            sx={{
              width: "100%",
              mt: "40px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress size={20} />
          </Box>
        ) : allExecutions.length > 0 ? (
          allExecutions.map((execution, i) => {
            return (
              <ExecutionCard
                key={i}
                execution={execution}
                templateData={templateData}
              />
            );
          })
        ) : (
          <Typography sx={{ mt: "40px", textAlign: "center" }}>
            No executions found
          </Typography>
        )}
      </Box>
    </Box>
  );
};
