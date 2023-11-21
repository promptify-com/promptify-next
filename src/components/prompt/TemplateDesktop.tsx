import { useEffect, type Dispatch, type SetStateAction } from "react";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";

import type { Templates, TemplatesExecutions } from "@/core/api/dto/templates";
import ClientOnly from "../base/ClientOnly";
import ChatMode from "./generate/ChatBox";
import Header from "./Header";
import TemplateToolbar from "./Toolbar";
import ToolbarDrawer from "./Toolbar/ToolbarDrawer";
import { Display } from "./Display";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setChatFullScreenStatus } from "@/core/store/templatesSlice";
import { setGeneratedExecution, setSelectedExecution, setSparkHashQueryParam } from "@/core/store/executionsSlice";
import { isValidUserFn } from "@/core/store/userSlice";
import { skipToken } from "@reduxjs/toolkit/dist/query";

import { useGetExecutionsByTemplateQuery } from "@/core/api/executions";

interface TemplateDesktopProps {
  template: Templates;
  setErrorMessage: Dispatch<SetStateAction<string>>;
}

export default function TemplateDesktop({ template, setErrorMessage }: TemplateDesktopProps) {
  const dispatch = useAppDispatch();
  const chatFullScreen = useAppSelector(state => state.template.isChatFullScreen);

  const isValidUser = useAppSelector(isValidUserFn);
  const selectedExecution = useAppSelector(state => state.executions.selectedExecution);
  const generatedExecution = useAppSelector(state => state.executions.generatedExecution);
  const isGenerating = useAppSelector(state => state.template.isGenerating);

  const {
    data: executions,
    isLoading: isExecutionsLoading,
    refetch: refetchTemplateExecutions,
  } = useGetExecutionsByTemplateQuery(isValidUser ? template.id : skipToken);

  const closeExecutionDisplay = () => {
    dispatch(setChatFullScreenStatus(true));
    dispatch(setSelectedExecution(null));
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
      height={"calc(100svh - 90px)"}
      gap={"1px"}
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
        height={"calc(100% - 68px)"}
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
          width={chatFullScreen ? "100%" : "58%"}
          position={"sticky"}
          top={0}
          zIndex={100}
          height={"100%"}
          overflow={"auto"}
          borderRight={"1px solid"}
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

        {!chatFullScreen && (
          <Grid
            width={"52%"}
            display={"block"}
          >
            <Display
              mode="display"
              templateData={template}
              close={closeExecutionDisplay}
            />
          </Grid>
        )}

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
