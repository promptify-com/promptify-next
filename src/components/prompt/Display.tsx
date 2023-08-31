import React, { useEffect, useRef, useState, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { Templates, TemplatesExecutions } from "@/core/api/dto/templates";
import { ExecutionCard } from "./ExecutionCard";
import { PromptLiveResponse } from "@/common/types/prompt";
import { ExecutionCardGenerated } from "./ExecutionCardGenerated";
import { DisplayActions } from "./DisplayActions";

import ParagraphPlaceholder from "@/components/placeholders/ParagraphPlaceholder";
import { useRouter } from "next/router";
import moment from "moment";
import { SparkExportPopup } from "../dialog/SparkExportPopup";

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
  const [firstLoad, setFirstLoad] = useState(true);
  const [search, setSearch] = useState<string>("");
  const router = useRouter();
  const sparkQueryParam = router.query?.spark as string;
  const [openExportPopup, setOpenExportpopup] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const activeExecution = useMemo(() => {
    if (selectedExecution) {
      return {
        ...selectedExecution,
        template: {
          ...selectedExecution.template,
          title: templateData.title,
          slug: templateData.slug,
          thumbnail: templateData.thumbnail,
        },
      };
    }
    return null;
  }, [selectedExecution, templateData]);

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

  const sortedExecutions = useMemo(() => {
    const _execuitons = [...(executions || [])]
      .reduce((uniqueExecs: TemplatesExecutions[], execution) => {
        if (!uniqueExecs.some((item: TemplatesExecutions) => item.id === execution.id)) {
          uniqueExecs.push(execution);
        }
        return uniqueExecs;
      }, [])
      .sort((a, b) => moment(b.created_at).diff(moment(a.created_at)));

    const wantedExecutionId = sparkQueryParam ?? selectedExecution?.id.toString();

    if (wantedExecutionId) {
      const _selectedExecution = _execuitons.find(exec => exec.id.toString() === wantedExecutionId);

      setSelectedExecution(_selectedExecution || _execuitons?.[0] || null);
    } else {
      setSelectedExecution(_execuitons?.[0] || null);
    }

    if (sparkQueryParam) {
      router.replace({ pathname: `/prompt/${templateData.slug}` }, undefined, { shallow: true, scroll: false });
    }

    return _execuitons;
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
        onOpenExport={() => setOpenExportpopup(true)}
      />

      {openExportPopup && (
        <SparkExportPopup
          onClose={() => setOpenExportpopup(false)}
          activeExecution={activeExecution}
        />
      )}

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
