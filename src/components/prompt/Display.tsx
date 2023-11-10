import React, { useEffect, useRef, useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Templates } from "@/core/api/dto/templates";
import { ExecutionCard } from "./ExecutionCard";
import { DisplayActions } from "./DisplayActions";
import ParagraphPlaceholder from "@/components/placeholders/ParagraphPlaceholder";
import { SparkExportPopup } from "../dialog/SparkExportPopup";
import { isDesktopViewPort } from "@/common/helpers";
import GeneratedExecutionFooter from "./GeneratedExecutionFooter";
import { useAppSelector } from "@/hooks/useStore";

interface Props {
  templateData: Templates;
  onError: (errMsg: string) => void;
  close: () => void;
}

export const Display: React.FC<Props> = ({ templateData, onError, close }) => {
  const [firstLoad, setFirstLoad] = useState(true);
  const [openExportPopup, setOpenExportpopup] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDesktopView = isDesktopViewPort();
  const selectedExecution = useAppSelector(state => state.executions.selectedExecution);
  const generatedExecution = useAppSelector(state => state.executions.generatedExecution);
  const isFetching = useAppSelector(state => state.executions.isFetching);
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
  }, [selectedExecution]);
  const isGeneratedExecutionEmpty = Boolean(generatedExecution && !generatedExecution.data?.length);
  const executionIsLoading = isFetching || isGeneratedExecutionEmpty;

  // click listener to remove opacity layer on first loaded execution
  useEffect(() => {
    const handleClick = () => setFirstLoad(false);

    const container = containerRef.current;
    container?.addEventListener("click", handleClick);

    return () => container?.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    // If there is a new execution being generated, remove opacity layer
    setFirstLoad(!generatedExecution);
  }, [generatedExecution]);

  const currentGeneratedPrompt = useMemo(() => {
    if (generatedExecution?.data?.length) {
      const loadingPrompt = generatedExecution.data.find(prompt => prompt.isLoading);
      const prompt = templateData.prompts.find(prompt => prompt.id === loadingPrompt?.prompt);
      if (prompt) return prompt;
    }

    return null;
  }, [generatedExecution]);

  return (
    <Grid
      display={"flex"}
      flexDirection={"column"}
      gap={"8px"}
    >
      <Box
        ref={containerRef}
        sx={{
          bgcolor: "surface.3",
          minHeight: { xs: "100vh", md: "calc(100vh - (90px + 68px))" },
          height: "1px",
          position: "relative",
          pb: { xs: "70px", md: "0" },
        }}
      >
        <DisplayActions
          selectedExecution={selectedExecution}
          onOpenExport={() => setOpenExportpopup(true)}
          close={close}
        />
        {openExportPopup && activeExecution?.id && (
          <SparkExportPopup
            onClose={() => setOpenExportpopup(false)}
            activeExecution={activeExecution}
          />
        )}

        <Box
          sx={{
            height: "calc(100% - 67px)",
            opacity: firstLoad ? 0.5 : 1,
            bgcolor: "surface.1",
            borderRadius: "16px 16px 0px 0px",
            position: "relative",
          }}
        >
          {executionIsLoading ? (
            <ParagraphPlaceholder />
          ) : !selectedExecution && isGeneratedExecutionEmpty ? (
            <Typography
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
              }}
            >
              No spark found
            </Typography>
          ) : (
            <ExecutionCard
              execution={generatedExecution ?? selectedExecution}
              promptsData={templateData.prompts}
            />
          )}
        </Box>
      </Box>
      {currentGeneratedPrompt && (
        <GeneratedExecutionFooter
          title={currentGeneratedPrompt.title}
          order={currentGeneratedPrompt.order}
          isMobile={!isDesktopView}
        />
      )}
    </Grid>
  );
};
