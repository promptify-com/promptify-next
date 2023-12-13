import { useEffect, type Dispatch, type SetStateAction } from "react";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { skipToken } from "@reduxjs/toolkit/dist/query";

import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setSelectedExecution, setSparkHashQueryParam } from "@/core/store/executionsSlice";
import { isValidUserFn } from "@/core/store/userSlice";
import { useGetExecutionsByTemplateQuery } from "@/core/api/executions";
import Chat from "@/components/Prompt/Common/Chat";
import Header from "@/components/Prompt/Common/Header";
import ClientOnly from "@/components/base/ClientOnly";
import type { Templates, TemplatesExecutions } from "@/core/api/dto/templates";
import { Sidebar } from "../Common/Sidebar";
import TopHeaderActions from "../Common/Sidebar/TopHeaderActions";

interface TemplateVariantBProps {
  template: Templates;
  setErrorMessage: Dispatch<SetStateAction<string>>;
  questionPrefixContent: string;
}

export default function TemplateVariantB({ template, setErrorMessage, questionPrefixContent }: TemplateVariantBProps) {
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

  return (
    <Stack
      mt={{ xs: 8, md: 0 }}
      height={{ xs: "calc(100svh - 65px)", md: "calc(100svh - 90px)" }}
    >
      <Header template={template} />

      <TopHeaderActions executionsLength={executions?.length} />
      <Grid
        mt={0}
        gap={"1px"}
        container
        flexWrap={"nowrap"}
        mx={"auto"}
        bgcolor={"surface.1"}
        width={"100%"}
        height={{ xs: "calc(100svh)", md: "calc(100% - 68px)" }}
        position={"relative"}
        overflow={"auto"}
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
          position={"sticky"}
          bottom={0}
          zIndex={100}
          height={"100%"}
          overflow={"auto"}
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
            <Chat
              onError={setErrorMessage}
              template={template}
              questionPrefixContent={questionPrefixContent}
            />
          </ClientOnly>
        </Stack>
        <Sidebar
          template={template}
          executions={executions ?? []}
          isLoading={isExecutionsLoading}
          refetchExecutions={refetchTemplateExecutions}
        />
      </Grid>
    </Stack>
  );
}
