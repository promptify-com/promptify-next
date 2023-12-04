import React, { useEffect, useRef, useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Templates } from "@/core/api/dto/templates";
import { ExecutionCard } from "./ExecutionCard";
import { DisplayActions } from "./DisplayActions";
import ParagraphPlaceholder from "@/components/placeholders/ParagraphPlaceholder";
import { SparkExportPopup } from "../dialog/SparkExportPopup";
import GeneratedExecutionFooter from "./GeneratedExecutionFooter";
import { useAppSelector } from "@/hooks/useStore";
import { Stack } from "@mui/material";

interface Props {
  templateData: Templates;
  close: () => void;
}

export const Display: React.FC<Props> = ({ templateData, close }) => {
  const currentUser = useAppSelector(state => state.user.currentUser);
  const [openExportPopup, setOpenExportpopup] = useState(false);
  const [previewsShown, setPreviewsShown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedExecution = useAppSelector(state => state.executions.selectedExecution);
  const generatedExecution = useAppSelector(state => state.executions.generatedExecution);
  const isGenerating = useAppSelector(state => state.template.isGenerating);
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

  const currentGeneratedPrompt = useMemo(() => {
    if (generatedExecution?.data?.length) {
      const loadingPrompt = generatedExecution.data.find(prompt => prompt.isLoading);
      const prompt = templateData.prompts.find(prompt => prompt.id === loadingPrompt?.prompt);
      if (prompt) return prompt;
    }

    return null;
  }, [generatedExecution]);

  const showPreviews = previewsShown && !isGenerating;

  return (
    <Grid
      display={"flex"}
      flexDirection={"column"}
    >
      <Box
        ref={containerRef}
        sx={{
          bgcolor: "surface.3",
          minHeight: { xs: "calc(100svh - (58px + 54px))", md: "calc(100svh - 90px)" },
          height: "1px",
          position: "relative",
        }}
      >
        {currentUser?.id && (
          <>
            <DisplayActions
              selectedExecution={selectedExecution}
              onOpenExport={() => setOpenExportpopup(true)}
              close={close}
              showPreviews={previewsShown}
              toggleShowPreviews={() => setPreviewsShown(!previewsShown)}
            />
            {openExportPopup && activeExecution?.id && (
              <SparkExportPopup
                onClose={() => setOpenExportpopup(false)}
                activeExecution={activeExecution}
              />
            )}
          </>
        )}

        <Box
          sx={{
            height: { xs: "calc(100% - 104px)", md: "calc(100% - 67px)" },
            overflow: "auto",
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
              No work found
            </Typography>
          ) : (
            <ExecutionCard
              execution={generatedExecution ?? selectedExecution}
              promptsData={templateData.prompts}
              showPreview={showPreviews}
            />
          )}
        </Box>
      </Box>
      {currentGeneratedPrompt && (
        <GeneratedExecutionFooter
          title={currentGeneratedPrompt.title}
          order={currentGeneratedPrompt.order}
        />
      )}
    </Grid>
  );
};
