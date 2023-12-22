import { useRef, useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import South from "@mui/icons-material/South";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import { Templates } from "@/core/api/dto/templates";
import { ExecutionCard } from "./ExecutionCard";
import { DisplayActions } from "./DisplayActions";
import ParagraphPlaceholder from "@/components/placeholders/ParagraphPlaceholder";
import { useAppSelector } from "@/hooks/useStore";
import { SparkExportPopup } from "@/components/dialog/SparkExportPopup";
import useScrollToBottom from "@/components/Prompt/Hooks/useScrolltoBottom";
import ExecutionFooter from "../Common/ExecutionFooter";

interface Props {
  templateData: Templates;
}

export const Display: React.FC<Props> = ({ templateData }) => {
  const currentUser = useAppSelector(state => state.user.currentUser);
  const selectedExecution = useAppSelector(state => state.executions.selectedExecution);
  const generatedExecution = useAppSelector(state => state.executions.generatedExecution);
  const isGenerating = useAppSelector(state => state.template.isGenerating);
  const isFetching = useAppSelector(state => state.executions.isFetching);

  const [openExportPopup, setOpenExportpopup] = useState(false);
  const [previewsShown, setPreviewsShown] = useState(false);
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
  }, [selectedExecution]);

  const { showScrollDown, scrollToBottom } = useScrollToBottom({ ref: containerRef, isGenerating });

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
        sx={{
          bgcolor: "surface.3",
          minHeight: {
            xs: `calc(100svh - (58px + 80px ${isGenerating ? "+ 30.5px" : ""}))`,
            md: "calc(100svh - (90px + 70.5px))",
          },
          height: "1px",
          position: "relative",
        }}
      >
        {currentUser?.id && (
          <>
            <DisplayActions
              selectedExecution={selectedExecution}
              onOpenExport={() => setOpenExportpopup(true)}
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
          ref={containerRef}
          sx={{
            height: { xs: `calc(100% - ${isGenerating ? "56" : "104"}px)`, md: "calc(100% - 67px)" },
            overflow: "auto",
            bgcolor: "surface.1",
            borderRadius: "16px 16px 0px 0px",
            position: "relative",
            "&::-webkit-scrollbar": {
              width: "6px",
              p: 1,
              bgcolor: "surface.3",
            },
            "&::-webkit-scrollbar-track": {
              webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
            },
            "&::-webkit-scrollbar-thumb": {
              bgcolor: "surface.1",
              outline: "1px solid surface.1",
              borderRadius: "10px",
            },
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
          {showScrollDown && isGenerating && (
            <IconButton
              onClick={scrollToBottom}
              sx={{
                height: "32px",
                width: "32px",
                position: "sticky",
                left: "50%",
                bottom: "30px",
                zIndex: 999,
                bgcolor: "surface.3",
                boxShadow: "0px 4px 8px 3px #e1e2ece6, 0px 0px 4px 0px rgb(0 0 0 / 0%)",
                border: " none",
                ":hover": {
                  bgcolor: "surface.5",
                },
              }}
            >
              <South sx={{ fontSize: 16 }} />
            </IconButton>
          )}
        </Box>
      </Box>
      {currentGeneratedPrompt && (
        <ExecutionFooter
          title={currentGeneratedPrompt.title}
          order={currentGeneratedPrompt.order}
        />
      )}
    </Grid>
  );
};
