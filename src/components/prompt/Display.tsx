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
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import FeedbackThumbs from "./FeedbackThumbs";
import { Replay } from "@mui/icons-material";

interface Props {
  mode: "chat" | "display";
  templateData: Templates;
  close?: () => void;
}

export const Display: React.FC<Props> = ({ mode, templateData, close }) => {
  const currentUser = useAppSelector(state => state.user.currentUser);
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

  const isDisplayMode = mode === "display";

  return (
    <Grid
      display={"flex"}
      flexDirection={"column"}
      gap={"8px"}
    >
      <Box
        ref={containerRef}
        sx={{
          bgcolor: isDisplayMode ? "surface.3" : "transparent",
          minHeight: { xs: "100vh", md: isDisplayMode ? "calc(100vh - (90px + 68px))" : "auto" },
          height: "1px",
          position: "relative",
          pb: { xs: "70px", md: "0" },
        }}
      >
        {currentUser?.id && mode === "display" && (
          <>
            <DisplayActions
              selectedExecution={selectedExecution}
              onOpenExport={() => setOpenExportpopup(true)}
              close={close!}
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
            height: isDisplayMode ? "calc(100% - 67px)" : "auto",
            overflow: "auto",
            opacity: firstLoad ? 0.5 : 1,
            bgcolor: "surface.1",
            borderRadius: "16px 16px 0px 0px",
            position: "relative",
          }}
        >
          {executionIsLoading ? (
            <ParagraphPlaceholder count={2} />
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
            <Stack flexDirection={"row"}>
              <ExecutionCard
                execution={generatedExecution ?? selectedExecution}
                promptsData={templateData.prompts}
              />
              {selectedExecution && (
                <Stack
                  gap={2}
                  position={"relative"}
                  width={"5%"}
                >
                  <Stack
                    direction={"column"}
                    alignItems={"center"}
                    position={"absolute"}
                    top={"40%"}
                    right={"-8px"}
                  >
                    <FeedbackThumbs execution={selectedExecution} />
                    <Button
                      onClick={() => {
                        console.log("replay");
                        // if (msg.spark) regenerate(msg.spark);
                      }}
                      variant="text"
                      startIcon={<Replay />}
                      sx={{
                        height: "22px",
                        width: "22px",
                        mt: "8px",
                        ":hover": {
                          bgcolor: "action.hover",
                        },
                      }}
                    />
                  </Stack>
                </Stack>
              )}
            </Stack>
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
