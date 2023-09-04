import React, { useEffect, useRef, useState, useMemo } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { useRouter } from "next/router";
import moment from "moment";

import { Templates, TemplatesExecutions } from "@/core/api/dto/templates";
import { ExecutionCard } from "./ExecutionCard";
import { PromptLiveResponse } from "@/common/types/prompt";
import { ExecutionCardGenerated } from "./ExecutionCardGenerated";
import { DisplayActions } from "./DisplayActions";
import ParagraphPlaceholder from "@/components/placeholders/ParagraphPlaceholder";
import { useWindowSize } from "usehooks-ts";
import { SparkExportPopup } from "../dialog/SparkExportPopup";
import { GeneratePrompts } from "./generate";
import { useWindowSize } from "usehooks-ts";

interface Props {
  templateData: Templates;
  executions: TemplatesExecutions[];
  isFetching?: boolean;
  selectedExecution: TemplatesExecutions | null;
  setSelectedExecution: (execution: TemplatesExecutions) => void;
  generatedExecution: PromptLiveResponse | null;
  setGeneratedExecution: (data: PromptLiveResponse) => void;
  isGenerating: boolean;
  setIsGenerating: (status: boolean) => void;
  onError: (errMsg: string) => void;
}

export const Display: React.FC<Props> = ({
  templateData,
  executions,
  isFetching,
  selectedExecution,
  setSelectedExecution,
  setGeneratedExecution,
  setIsGenerating,
  onError,
  isGenerating,
  generatedExecution,
}) => {
  const { width: windowWidth } = useWindowSize();

  const [errorMessage, setErrorMessage] = useState("");
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
    if (!executions?.length) {
      return [];
    }

    const _execuitons = [...executions]
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
    <Grid
      display={"flex"}
      flexDirection={"column"}
      gap={"24px"}
    >
      {windowWidth > 960 && (
        <GeneratePrompts
          type="chat"
          templateData={templateData}
          selectedExecution={selectedExecution}
          setGeneratedExecution={setGeneratedExecution}
          isGenerating={isGenerating}
          setIsGenerating={setIsGenerating}
          onError={setErrorMessage}
        />
      )}

      <Box
        ref={containerRef}
        bgcolor={"surface.1"}
        borderRadius={"16px"}
        minHeight={{ xs: "100%", md: "calc(100vh - (95px + 48px + 24px))" }}
        sx={{
          position: "relative",
          pb: { xs: "70px", md: "0" },
        }}
      >
        <DisplayActions
          executions={sortedExecutions}
          selectedExecution={selectedExecution}
          setSelectedExecution={setSelectedExecution}
          onSearch={text => setSearch(text)}
          //@ts-ignore
          onOpenExport={activeExecution}
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
    </Grid>
  );
};
