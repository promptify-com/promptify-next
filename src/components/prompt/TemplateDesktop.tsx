import { useEffect, type Dispatch, type SetStateAction } from "react";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { skipToken } from "@reduxjs/toolkit/dist/query";

import type { Templates, TemplatesExecutions } from "@/core/api/dto/templates";
import ClientOnly from "../base/ClientOnly";
import ChatMode from "./generate/ChatBox";
import Header from "./Header";
import TemplateToolbar from "./Toolbar";
import ToolbarDrawer from "./Toolbar/ToolbarDrawer";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setAccordionChatMode } from "@/core/store/templatesSlice";
import { setGeneratedExecution, setSelectedExecution, setSparkHashQueryParam } from "@/core/store/executionsSlice";
import { isValidUserFn } from "@/core/store/userSlice";
import { useGetExecutionsByTemplateQuery } from "@/core/api/executions";

interface TemplateDesktopProps {
  template: Templates;
  setErrorMessage: Dispatch<SetStateAction<string>>;
}

export default function TemplateDesktop({ template, setErrorMessage }: TemplateDesktopProps) {
  const dispatch = useAppDispatch();

  const isValidUser = useAppSelector(isValidUserFn);
  const selectedExecution = useAppSelector(state => state.executions.selectedExecution);
  const generatedExecution = useAppSelector(state => state.executions.generatedExecution);
  const isGenerating = useAppSelector(state => state.template.isGenerating);

  const {
    data: executions,
    isLoading: isExecutionsLoading,
    refetch: refetchTemplateExecutions,
  } = useGetExecutionsByTemplateQuery(isValidUser ? template.id : skipToken);

  useEffect(() => {
    if (!isGenerating && generatedExecution?.data?.length) {
      const promptNotCompleted = generatedExecution.data.find(execData => !execData.isCompleted);

      if (!promptNotCompleted) {
        dispatch(setSelectedExecution(null));
        dispatch(setGeneratedExecution(null));
        refetchTemplateExecutions();
      }
    }
  }, [isGenerating, generatedExecution]);

  const handleSelectExecution = ({
    execution,
    resetHash = false,
  }: {
    execution: TemplatesExecutions | null;
    resetHash?: boolean;
  }) => {
    if (resetHash) {
      dispatch(setSparkHashQueryParam(null));
    }

    dispatch(setSelectedExecution(execution));
  };

  useEffect(() => {
    if (!executions) {
      return;
    }

    const wantedExecutionId = selectedExecution?.id.toString();

    if (wantedExecutionId) {
      const _selectedExecution = executions.find(exec => exec.id.toString() === wantedExecutionId);

      handleSelectExecution({ execution: _selectedExecution || null, resetHash: true });
    } else {
      handleSelectExecution({ execution: template.example_execution || null, resetHash: true });
    }
  }, [executions]);

  useEffect(() => {
    if (selectedExecution) {
      dispatch(setAccordionChatMode("execution"));
    }
  }, [selectedExecution]);

  return (
    <Stack
      mt={{ xs: 5, md: 0 }}
      height={{ md: "calc(100svh - 90px)" }}
      gap={"1px"}
      mx={{ xs: "16px", md: 0 }}
    >
      <Header template={template} />
      <Grid
        mt={0}
        gap={"1px"}
        container
        flexWrap={"nowrap"}
        mx={"auto"}
        bgcolor={"surface.1"}
        width={"100%"}
        height={{ md: "calc(100% - 68px)" }}
        position={"relative"}
        overflow={{ md: "auto" }}
        sx={{
          "&::-webkit-scrollbar": {
            width: "6px",
            p: 1,
            bgcolor: "surface.1",
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
        <Stack
          width={"100%"}
          position={{ md: "sticky" }}
          bottom={0}
          zIndex={100}
          height={{ md: "100%" }}
          overflow={{ md: "auto" }}
          sx={{
            borderColor: "surface.3",
            "&::-webkit-scrollbar": {
              width: "6px",
              p: 1,
              backgroundColor: "surface.5",
            },
            "&::-webkit-scrollbar-track": {
              webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "surface.1",
              outline: "1px solid surface.1",
              borderRadius: "10px",
            },
          }}
        >
          <ClientOnly>
            <ChatMode
              onError={setErrorMessage}
              template={template}
            />
          </ClientOnly>
        </Stack>

        <TemplateToolbar template={template} />
        <ToolbarDrawer
          template={template}
          executions={executions!}
          isExecutionsLoading={isExecutionsLoading}
          refetchTemplateExecutions={refetchTemplateExecutions}
        />
      </Grid>
    </Stack>
  );
}
