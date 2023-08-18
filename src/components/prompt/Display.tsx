import React, { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import {
  Templates,
  TemplatesExecutions,
} from "@/core/api/dto/templates";
import { ExecutionCard } from "./ExecutionCard";
import { PromptLiveResponse } from "@/common/types/prompt";
import { ExecutionCardGenerated } from "./ExecutionCardGenerated";
import { DisplayActions } from "./DisplayActions";
import { addToFavorite, removeFromFavorite } from "@/hooks/api/executions";

import ParagraphPlaceholder from "@/components/placeholders/ParagraphPlaceholder";

interface Props {
  templateData: Templates;
  executions: TemplatesExecutions[];
  isFetching?: boolean;
  selectedExecution: TemplatesExecutions | null;
  setSelectedExecution: (execution: TemplatesExecutions) => void;
  newExecutionData: PromptLiveResponse | null;
}

export const Display: React.FC<Props> = ({
  templateData,
  executions,
  isFetching,
  selectedExecution,
  setSelectedExecution,
  newExecutionData,
}) => {
  const [sortedExecutions, setSortedExecutions] = useState<TemplatesExecutions[]>([]);
  const [firstLoad, setFirstLoad] = useState(true);
  const [search, setSearch] = useState<string>("");

  const containerRef = useRef<HTMLDivElement>(null);

  // click listener to remove opacity layer on first loaded execution
  useEffect(() => {
    const handleClick = () => setFirstLoad(false);

    const container = containerRef.current;
    container?.addEventListener("click", handleClick);

    return () => container?.removeEventListener("click", handleClick);
  }, []);
  // If there is a new execution being generated, remove opacity layer
  useEffect(() => {
    if (newExecutionData) setFirstLoad(false);
  }, [newExecutionData]);

  useEffect(() => {
    setSortedExecutions(executions);
  }, [executions]);

  const handlePinExecution = async () => {
    if (selectedExecution === null) return;

    try {
      if (selectedExecution.is_favorite) {
        await removeFromFavorite(selectedExecution.id);
      } else {
        await addToFavorite(selectedExecution.id);
      }

      // Update state after API call is successful and avoid unnecessary refetch of executions
      const updatedExecs = sortedExecutions.map((exec) => {
        if (exec.id === selectedExecution?.id) {
          return {
            ...exec,
            is_favorite: !selectedExecution.is_favorite,
          };
        }
        return exec;
      });
      setSortedExecutions(updatedExecs);
      setSelectedExecution({
        ...selectedExecution,
        is_favorite: !selectedExecution.is_favorite,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        minHeight: "calc(100% - 31px)",
        position: "relative",
        pb: { xs: "70px", md: "0" }
      }}
    >
      <DisplayActions
        executions={sortedExecutions}
        selectedExecution={selectedExecution}
        setSelectedExecution={setSelectedExecution}
        pinExecution={handlePinExecution}
        onSearch={(text) => setSearch(text)}
      />

      <Box sx={{ mx: "15px", opacity: firstLoad ? 0.5 : 1 }}>
        {
          // If there is a new execution being generated, show it first
          newExecutionData ? (
            <ExecutionCardGenerated
              execution={newExecutionData}
              templateData={templateData}
            />
          ) : // If there is no new execution being generated, show the selected execution
          isFetching ? (
            <ParagraphPlaceholder />
          ) : selectedExecution ? (
            <ExecutionCard
              execution={selectedExecution}
              templateData={templateData}
              search={search}
            />
          ) : (
            <Typography sx={{ mt: "40px", textAlign: "center" }}>
              No spark found
            </Typography>
          )
        }
      </Box>
    </Box>
  );
};
