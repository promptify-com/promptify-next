import React, { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { Templates, TemplatesExecutions } from "@/core/api/dto/templates";
import { ExecutionCard } from "./ExecutionCard";
import { PromptLiveResponse } from "@/common/types/prompt";
import { ExecutionCardGenerated } from "./ExecutionCardGenerated";
import { DisplayActions } from "./DisplayActions";

import ParagraphPlaceholder from "@/components/placeholders/ParagraphPlaceholder";
import { useRouter } from "next/router";
import moment from "moment";

interface Props {
  templateData: Templates;
  executions: TemplatesExecutions[];
  isFetching?: boolean;
  selectedExecution: TemplatesExecutions | null;
  setSelectedExecution: (execution: TemplatesExecutions) => void;
  generatedExecution: PromptLiveResponse | null;
}

export const Display: React.FC<Props> = ({
  templateData,
  executions,
  isFetching,
  selectedExecution,
  setSelectedExecution,
  generatedExecution,
}) => {
  const [sortedExecutions, setSortedExecutions] = useState(executions);
  const [firstLoad, setFirstLoad] = useState(true);
  const [search, setSearch] = useState<string>("");
  const router = useRouter();
  const routerSpark = router.query?.spark;

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
    if (generatedExecution) setFirstLoad(false);
  }, [generatedExecution]);

  useEffect(() => {
    const sorted = [...(executions || [])]
      .reduce((uniqueExecs: TemplatesExecutions[], execution) => {
        if (!uniqueExecs.some((item: TemplatesExecutions) => item.id === execution.id)) {
          uniqueExecs.push(execution);
        }
        return uniqueExecs;
      }, [])
      .sort((a, b) => moment(b.created_at).diff(moment(a.created_at)));
    setSortedExecutions(sorted);

    // Selected execution already set ==> executions list mutated and refetched
    // the router spark param considered only on the first component load, otherwise select the latest execution
    let spark = !!selectedExecution
      ? sorted.find(exec => exec.id === selectedExecution.id)
      : firstLoad && routerSpark && sorted.find(exec => exec.id.toString() === routerSpark);

    setSelectedExecution(spark || sorted[0]);
  }, [executions]);

  return (
    <Box
      ref={containerRef}
      sx={{
        minHeight: "calc(100% - 31px)",
        position: "relative",
        pb: { xs: "70px", md: "0" },
      }}
    >
      <DisplayActions
        executions={sortedExecutions}
        selectedExecution={selectedExecution}
        setSelectedExecution={setSelectedExecution}
        onSearch={text => setSearch(text)}
      />

      <Box sx={{ mx: "15px", opacity: firstLoad ? 0.5 : 1 }}>
        {
          // If there is a new execution being generated, show it first
          generatedExecution ? (
            <ExecutionCardGenerated
              execution={generatedExecution}
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
            <Typography sx={{ mt: "40px", textAlign: "center" }}>No spark found</Typography>
          )
        }
      </Box>
    </Box>
  );
};
