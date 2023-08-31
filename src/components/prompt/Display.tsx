import React, { useEffect, useRef, useState, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { Templates, TemplatesExecutions } from "@/core/api/dto/templates";
import { ExecutionCard } from "./ExecutionCard";
import { PromptLiveResponse } from "@/common/types/prompt";
import { ExecutionCardGenerated } from "./ExecutionCardGenerated";
import { DisplayActions } from "./DisplayActions";
import ParagraphPlaceholder from "@/components/placeholders/ParagraphPlaceholder";
import { useRouter } from "next/router";
import { SparkExportPopup } from "../dialog/SparkExportPopup";
import useBrowser from "@/hooks/useBrowser";

interface Props {
  templateData: Templates;
  executions: TemplatesExecutions[];
  isFetching?: boolean;
  selectedExecution: TemplatesExecutions | null;
  setSelectedExecution: (execution: TemplatesExecutions | null) => void;
  generatedExecution: PromptLiveResponse | null;
  hashedExecution: TemplatesExecutions | null;
}

export const Display: React.FC<Props> = ({
  templateData,
  executions,
  isFetching,
  selectedExecution,
  setSelectedExecution,
  generatedExecution,
  hashedExecution,
}) => {
  const [firstLoad, setFirstLoad] = useState(true);
  const [search, setSearch] = useState<string>("");
  const router = useRouter();
  const sparkQueryParam = router.query?.spark as string;
  const sparkHashQueryParam = useRef((router.query?.hash as string | null) ?? null);
  const [openExportPopup, setOpenExportpopup] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { replaceHistoryByPathname } = useBrowser();

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
    if (generatedExecution) {
      setFirstLoad(false);
    }

    const routeChangeCompleteHandler = () => {
      sparkHashQueryParam.current = null;
    };
    router.events.on("routeChangeComplete", routeChangeCompleteHandler);

    return () => {
      router.events.off("routeChangeComplete", routeChangeCompleteHandler);
    };
  }, [generatedExecution, router]);

  const handleSelectExecution = ({
    execution,
    resetHash = false,
  }: {
    execution: TemplatesExecutions | null;
    resetHash?: boolean;
  }) => {
    if (resetHash) {
      sparkHashQueryParam.current = null;
    }

    setSelectedExecution(execution);
  };

  const selectedExecutionId = sparkQueryParam ?? selectedExecution?.id.toString();
  const isGeneratedExecutionEmpty = Boolean(generatedExecution && !generatedExecution?.data?.length);

  if (sparkHashQueryParam.current) {
    handleSelectExecution({ execution: hashedExecution });
    replaceHistoryByPathname(`/prompt/${templateData.slug}`);
  } else if (selectedExecutionId) {
    const _selectedExecution = executions.find(_execution => _execution.id.toString() === selectedExecutionId);

    handleSelectExecution({ execution: _selectedExecution || executions?.[0] || null, resetHash: true });
  } else {
    handleSelectExecution({ execution: executions?.[0] || null, resetHash: true });
  }

  if (sparkQueryParam) {
    replaceHistoryByPathname(`/prompt/${templateData.slug}`);
  }

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
        executions={executions}
        selectedExecution={selectedExecution}
        setSelectedExecution={_execution => {
          handleSelectExecution({ execution: _execution, resetHash: true });
        }}
        onSearch={text => setSearch(text)}
        onOpenExport={() => setOpenExportpopup(true)}
        sparkHashQueryParam={sparkHashQueryParam.current}
      />
      {openExportPopup && activeExecution?.id && (
        <SparkExportPopup
          onClose={() => setOpenExportpopup(false)}
          activeExecution={activeExecution}
        />
      )}

      <Box sx={{ mx: "15px", opacity: firstLoad ? 0.5 : 1 }}>
        {isGeneratedExecutionEmpty ? (
          <ParagraphPlaceholder />
        ) : generatedExecution?.data ? (
          <ExecutionCardGenerated
            execution={generatedExecution}
            templateData={templateData}
          />
        ) : isFetching ? (
          <ParagraphPlaceholder />
        ) : selectedExecution ? (
          <ExecutionCard
            execution={selectedExecution}
            templateData={templateData}
            search={search}
            sparkHashQueryParam={sparkHashQueryParam.current}
          />
        ) : (
          <Typography sx={{ mt: "40px", textAlign: "center" }}>No spark found</Typography>
        )}
      </Box>
    </Box>
  );
};
