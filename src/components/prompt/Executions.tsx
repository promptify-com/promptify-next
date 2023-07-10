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
  const [searchText, setSearchText] = useState("");
  const [favoriteSearch, setFavoriteSearch] = useState(false);
  const [searchShown, setSearchShown] = useState(false);

  const allExecutions = executions
    .slice()
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .filter((exec) => {
      return exec.prompt_executions.some((promptExec) =>
        promptExec.output.toLowerCase().includes(searchText.toLowerCase())
      );
    });

  const favoritedExecutions = allExecutions.filter(
    (execution) => execution.is_favorite
  );

  const filteredExecutions = favoriteSearch
    ? favoritedExecutions
    : allExecutions;

  return (
    <Box sx={{ position: "relative", px: "16px" }}>

      <ExecutionsHeader />

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
        ) : filteredExecutions.length > 0 ? (
          filteredExecutions.map((execution, i) => {
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
