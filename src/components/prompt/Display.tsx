import React, { useEffect, useRef, useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Templates, TemplatesExecutions } from "@/core/api/dto/templates";
import { ExecutionCard } from "./ExecutionCard";
import { PromptLiveResponse } from "@/common/types/prompt";
import { DisplayActions } from "./DisplayActions";
import ParagraphPlaceholder from "@/components/placeholders/ParagraphPlaceholder";
import { useRouter } from "next/router";
import { SparkExportPopup } from "../dialog/SparkExportPopup";
import { isDesktopViewPort } from "@/common/helpers";
import ChatMode from "./generate/ChatBox";
import useBrowser from "@/hooks/useBrowser";
import ClientOnly from "@/components/base/ClientOnly";
import GeneratedExecutionFooter from "./GeneratedExecutionFooter";
import { useGetExecutionsByTemplateQuery } from "@/core/api/executions";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { isValidUserFn } from "@/core/store/userSlice";
import { setGeneratedExecution, setSelectedExecution } from "@/core/store/executionsSlice";

interface Props {
  templateData: Templates;
  onError: (errMsg: string) => void;
  hashedExecution: TemplatesExecutions | null;
}

export const Display: React.FC<Props> = ({ templateData, onError, hashedExecution }) => {
  const [firstLoad, setFirstLoad] = useState(true);
  const [search, setSearch] = useState<string>("");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const sparkQueryParam = router.query?.spark as string;
  const sparkHashQueryParam = useRef((router.query?.hash as string | null) ?? null);
  const [openExportPopup, setOpenExportpopup] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isValidUser = useAppSelector(isValidUserFn);
  const { replaceHistoryByPathname } = useBrowser();
  const isDesktopView = isDesktopViewPort();
  const isGenerating = useAppSelector(state => state.template.isGenerating);
  const selectedExecution = useAppSelector(state => state.executions.selectedExecution);
  const generatedExecution = useAppSelector(state => state.executions.generatedExecution);
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
  const {
    data: executions,
    isFetching,
    refetch: refetchTemplateExecutions,
  } = useGetExecutionsByTemplateQuery(isValidUser ? templateData.id : skipToken);
  const executionIsLoading = isFetching || isGeneratedExecutionEmpty;
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

    dispatch(setSelectedExecution(execution));
  };

  useEffect(() => {
    if (!isGenerating && generatedExecution?.data?.length) {
      const promptNotCompleted = generatedExecution.data.find(execData => !execData.isCompleted);

      if (!promptNotCompleted) {
        dispatch(setSelectedExecution(null));
        dispatch(setGeneratedExecution(null));
        refetchTemplateExecutions();
      }
    }

    // If there is a new execution being generated, remove opacity layer
    if (generatedExecution) {
      setFirstLoad(false);
    }
  }, [isGenerating, generatedExecution]);

  // click listener to remove opacity layer on first loaded execution
  useEffect(() => {
    const handleClick = () => setFirstLoad(false);

    const container = containerRef.current;
    container?.addEventListener("click", handleClick);

    return () => container?.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    if (sparkHashQueryParam.current && hashedExecution) {
      dispatch(setSelectedExecution(hashedExecution));
      replaceHistoryByPathname(`/prompt/${templateData.slug}`);
      return;
    }

    if (!executions) {
      return;
    }

    const wantedExecutionId = sparkQueryParam ?? selectedExecution?.id.toString();

    if (wantedExecutionId) {
      const _selectedExecution = executions.find(exec => exec.id.toString() === wantedExecutionId);

      handleSelectExecution({ execution: _selectedExecution || executions?.[0] || null, resetHash: true });
    } else {
      handleSelectExecution({ execution: templateData.example_execution || executions?.[0] || null, resetHash: true });
    }

    if (sparkQueryParam) {
      replaceHistoryByPathname(`/prompt/${templateData.slug}`);
    }
  }, [executions]);

  const currentGeneratedPrompt = useMemo(() => {
    if (generatedExecution?.data?.length) {
      const loadingPrompt = generatedExecution.data.find(prompt => prompt.isLoading);
      const prompt = templateData.prompts.find(prompt => prompt.id === loadingPrompt?.prompt);
      if (prompt) return prompt;
    }

    return null;
  }, [generatedExecution]);
  const showChatForm = !!templateData?.questions?.length && templateData?.status === "PUBLISHED";

  return (
    <Grid
      display={"flex"}
      flexDirection={"column"}
      gap={"8px"}
    >
      <Box
        ref={containerRef}
        bgcolor={"surface.1"}
        borderRadius={"16px"}
        minHeight={{ xs: "100vh", md: "calc(100vh - (95px + 24px))" }}
        sx={{
          position: "relative",
          pb: { xs: "70px", md: "0" },
        }}
      >
        <DisplayActions
          executions={executions ?? []}
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
          {executionIsLoading ? (
            <ParagraphPlaceholder />
          ) : !selectedExecution && isGeneratedExecutionEmpty ? (
            <Typography sx={{ mt: "40px", textAlign: "center" }}>No spark found</Typography>
          ) : (
            <ExecutionCard
              execution={generatedExecution ?? selectedExecution}
              promptsData={templateData.prompts}
              search={search}
              sparkHashQueryParam={sparkHashQueryParam.current}
            />
          )}
        </Box>
      </Box>
      {isDesktopView && showChatForm && (
        <Box
          sx={{
            position: "sticky",
            bottom: currentGeneratedPrompt ? "30px" : "0px",
            left: 0,
            right: 0,
          }}
        >
          <ClientOnly>
            <ChatMode
              key={templateData.id}
              onError={onError}
              template={templateData}
            />
          </ClientOnly>
        </Box>
      )}
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
