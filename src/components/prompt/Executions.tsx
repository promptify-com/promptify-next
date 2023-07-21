import React, { useEffect, useRef, useState } from "react";
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
import { addToFavorite, removeFromFavorite } from "@/hooks/api/executions";
import { useRouter } from "next/router";

interface Props {
  templateData: Templates;
  executions: TemplatesExecutions[];
  isFetching?: boolean;
  newExecutionData: PromptLiveResponse | null;
  defaultExecution: TemplatesExecutions | null;
  refetchExecutions: () => void;
}

export const Executions: React.FC<Props> = ({
  templateData,
  executions,
  isFetching,
  defaultExecution,
  newExecutionData,
  refetchExecutions,
}) => {
  const [selectedExecution, setSelectedExecution] = useState<TemplatesExecutions | null>(null);
  const [sortedExecutions, setSortedExecutions] = useState<TemplatesExecutions[]>([]);
  const [firstLoad, setFirstLoad] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const routerSpark = router.query?.spark;

  // click listener to remove opacity layer on first loaded execution
  useEffect(() => {
    const handleClick = () => setFirstLoad(false)
    
    const container = containerRef.current;
    container?.addEventListener('click', handleClick);

    return () => container?.removeEventListener('click', handleClick);
  }, []);
  // If there is a new execution being generated, remove opacity layer
  useEffect(() => {
    if(newExecutionData) setFirstLoad(false)
  }, [newExecutionData])
  
  useEffect(() => {
    const sorted = [...executions].sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    setSortedExecutions(sorted)
    setSelectedExecution(sorted[0] || null)
  }, [executions])

  useEffect(() => {
    if (routerSpark) {
      const execution = executions.find((exec) => exec.id.toString() === routerSpark);
      if (execution) 
        setSelectedExecution(execution);
    }
  }, [routerSpark, executions]);

  useEffect(() => {
    if(defaultExecution) {
      setSelectedExecution({
        ...defaultExecution as TemplatesExecutions,
        prompt_executions: selectedExecution?.prompt_executions || [],
      })
      setFirstLoad(true)
    }
  }, [defaultExecution])

  const pinExecution = async () => {
    if(selectedExecution === null) return;

    try {
      if (selectedExecution.is_favorite) {
        await removeFromFavorite(selectedExecution.id);
      } else {
        await addToFavorite(selectedExecution.id);
      }

      // Update state after API call is successful and avoid unnecessary refetch of executions
      const updatedExecutions = sortedExecutions.map((exec) => {
        if (exec.id === selectedExecution.id) {
          return {
            ...exec,
            is_favorite: !exec.is_favorite,
          };
        }
        return exec;
      })
      setSortedExecutions(updatedExecutions)
      setSelectedExecution({ ...selectedExecution, is_favorite: !selectedExecution.is_favorite })
      
    } catch (error) {
        console.error(error);
    }
  }

  return (
    <Box ref={containerRef}
     sx={{ 
        minHeight: "calc(100% - 31px)",
        position: "relative" 
      }}
    >

      <ExecutionsHeader 
        executions={sortedExecutions}
        selectedExecution={selectedExecution}
        changeSelectedExecution={setSelectedExecution}
        pinExecution={pinExecution}
      />

      <Box sx={{ mx: "15px", opacity: firstLoad ? .5 : 1 }}>
        {
          // If there is a new execution being generated, show it first
          newExecutionData ? (
            <ExecutionCardGenerated
              execution={newExecutionData}
              templateData={templateData}
            />
          ) : (
            // If there is no new execution being generated, show the selected execution
            isFetching ? (
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
            ) : selectedExecution ? (
              <ExecutionCard
                execution={selectedExecution}
                templateData={templateData}
              />
            ) : (
              <Typography sx={{ mt: "40px", textAlign: "center" }}>
                No spark found
              </Typography>
            )
          )
        }
      </Box>
    </Box>
  );
};
