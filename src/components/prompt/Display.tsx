import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import { Spark, Templates, TemplatesExecutions } from "@/core/api/dto/templates";
import { ExecutionCard } from "./ExecutionCard";
import { PromptLiveResponse } from "@/common/types/prompt";
import { ExecutionCardGenerated } from "./ExecutionCardGenerated";
import { DisplayHeader } from "./DisplayHeader";
import {  pinSpark, unpinSpark } from "@/hooks/api/executions";
import { useRouter } from "next/router";

interface Props {
  templateData: Templates;
  sparks: Spark[];
  selectedSpark: Spark | null;
  setSelectedSpark: (spark: Spark) => void;
  selectedExecution: TemplatesExecutions | null;
  isFetching?: boolean;
  newExecutionData: PromptLiveResponse | null;
  refetchExecutions: () => void;
}

export const Display: React.FC<Props> = ({
  templateData,
  sparks,
  selectedSpark,
  setSelectedSpark,
  selectedExecution,
  isFetching,
  newExecutionData,
  refetchExecutions,
}) => {
  const [sortedSparks, setSortedSparks] = useState<Spark[]>([]);
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
    const sorted = [...sparks].sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    setSortedSparks(sorted)
  }, [sparks])

  useEffect(() => {
    if (routerSpark) {
      const spark = sparks.find((spark) => spark.id.toString() === routerSpark);
      if (spark) 
        setSelectedSpark(spark);
    }
  }, [routerSpark, sparks]);

  const handlePinSpark = async () => {
    if(selectedSpark === null) return;

    try {
      if (selectedSpark.is_favorite) {
        await pinSpark(selectedSpark.id);
      } else {
        await unpinSpark(selectedSpark.id);
      }

      // Update state after API call is successful and avoid unnecessary refetch of sparks
      const updatedSparks = sortedSparks.map((spark) => {
        if (spark.id === selectedSpark?.id) {
          return {
            ...spark,
            is_favorite: !selectedSpark.is_favorite,
          };
        }
        return spark;
      })
      setSortedSparks(updatedSparks)
      setSelectedSpark({ 
        ...selectedSpark, 
        is_favorite: !selectedSpark.is_favorite 
      })
      
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

      <DisplayHeader 
        sparks={sortedSparks}
        selectedSpark={selectedSpark}
        changeSelectedSpark={setSelectedSpark}
        pinSpark={handlePinSpark}
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
