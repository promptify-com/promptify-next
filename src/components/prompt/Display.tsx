import React, { useEffect, useRef, useState } from "react";
import { Box, CircularProgress, Skeleton, Typography } from "@mui/material";
import {
  Spark,
  Templates,
  TemplatesExecutions,
} from "@/core/api/dto/templates";
import { ExecutionCard } from "./ExecutionCard";
import { PromptLiveResponse } from "@/common/types/prompt";
import { ExecutionCardGenerated } from "./ExecutionCardGenerated";
import { DisplayHeader } from "./DisplayHeader";
import { pinSpark, unpinSpark } from "@/hooks/api/executions";
import { useRouter } from "next/router";
import moment from "moment";

interface Props {
  templateData: Templates;
  sparks: Spark[];
  selectedSpark: Spark | null;
  setSelectedSpark: (spark: Spark) => void;
  selectedExecution: TemplatesExecutions | null;
  isFetching?: boolean;
  newExecutionData: PromptLiveResponse | null;
}

export const Display: React.FC<Props> = ({
  templateData,
  sparks,
  selectedSpark,
  setSelectedSpark,
  selectedExecution,
  isFetching,
  newExecutionData,
}) => {
  const [sortedSparks, setSortedSparks] = useState<Spark[]>([]);
  const [firstLoad, setFirstLoad] = useState(true);
  const [search, setSearch] = useState<string>("");

  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const routerSpark = router.query?.spark;

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
    setSortedSparks(sparks);
  }, [sparks]);

  useEffect(() => {
    if (routerSpark) {
      const spark = sortedSparks.find(
        (spark) => spark.id.toString() === routerSpark
      );
      if (spark) setSelectedSpark(spark);
    }
  }, [routerSpark, sortedSparks]);

  const handlePinSpark = async () => {
    if (selectedSpark === null) return;

    try {
      if (selectedSpark.is_favorite) {
        await unpinSpark(selectedSpark.id);
      } else {
        await pinSpark(selectedSpark.id);
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
      });
      setSortedSparks(updatedSparks);
      setSelectedSpark({
        ...selectedSpark,
        is_favorite: !selectedSpark.is_favorite,
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
      }}
    >
      <DisplayHeader
        sparks={sortedSparks}
        selectedSpark={selectedSpark}
        changeSelectedSpark={setSelectedSpark}
        pinSpark={handlePinSpark}
        showSearchBar
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
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
            >
              {Array.from({ length: 12 }).map((_, index) => (
                <Skeleton
                  key={index}
                  variant="text"
                  width={"60%"}
                  height={16}
                  sx={{ marginBottom: "8px" }}
                />
              ))}
            </Box>
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
