import React, { useEffect, type Dispatch, type SetStateAction } from "react";
import Stack from "@mui/material/Stack";
import { Display } from "./Display";
import type { Templates, TemplatesExecutions } from "@/core/api/dto/templates";

import ChatBox from "./ChatBox";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { isValidUserFn } from "@/core/store/userSlice";
import { useGetExecutionsByTemplateQuery } from "@/core/api/executions";
import { Box } from "@mui/material";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import ClientOnly from "@/components/base/ClientOnly";
import Header from "../Common/Header";
import TopHeaderActions from "../Common/Sidebar/TopHeaderActions";
import { setSelectedExecution, setSparkHashQueryParam } from "@/core/store/executionsSlice";
import { Sidebar } from "../Common/Sidebar";

interface TemplateLayoutProps {
  template: Templates;
  setErrorMessage: Dispatch<SetStateAction<string>>;
  questionPrefixContent: string;
}

export default function TemplateVariantA({ template, setErrorMessage, questionPrefixContent }: TemplateLayoutProps) {
  const selectedExecution = useAppSelector(state => state.executions.selectedExecution);
  const generatedExecution = useAppSelector(state => state.executions.generatedExecution);

  const dispatch = useAppDispatch();

  const isExecutionShown = Boolean(selectedExecution ?? generatedExecution);

  const isValidUser = useAppSelector(isValidUserFn);
  const {
    data: executions,
    isLoading: isExecutionsLoading,
    refetch: refetchTemplateExecutions,
  } = useGetExecutionsByTemplateQuery(isValidUser ? template.id : skipToken);

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
      height={{ md: "calc(100svh - 90px)" }}
      bgcolor={"surface.3"}
      gap={"2px"}
    >
      <Header template={template} />

      <Stack
        direction={{ md: "row" }}
        flexWrap={{ md: "nowrap" }}
        gap={{ md: "1px" }}
        sx={{
          width: "100%",
          height: { xs: "calc(100svh - 56px)", md: "calc(100% - 70.5px)" },
          mt: { xs: "58px", md: 0 },
          mx: "auto",
          bgcolor: "surface.3",
          position: "relative",
          overflow: "auto",
          "&::-webkit-scrollbar": {
            width: { xs: "3px", md: "6px" },
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
        <TopHeaderActions executionsLength={executions?.length} />

        <Stack
          display={{ xs: !isExecutionShown ? "flex" : "none", md: "flex" }}
          sx={{
            height: { xs: "calc(100% - 54px)", md: "100%" },
            width: { xs: "100%", md: !isExecutionShown ? "100%" : "38%" },
            minWidth: { md: 360 },
            position: { md: "sticky" },
            top: { md: 0 },
            zIndex: { md: 100 },
            overflow: { md: "auto" },
            "&::-webkit-scrollbar": {
              width: { xs: "3px", md: "6px" },
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
            <ChatBox
              onError={setErrorMessage}
              template={template}
              questionPrefixContent={questionPrefixContent}
            />
          </ClientOnly>
        </Stack>

        {isExecutionShown && (
          <Box
            width={{ md: "62%" }}
            flex={{ xs: 1, md: "auto" }}
          >
            <Display templateData={template} />
          </Box>
        )}

        <Sidebar
          template={template}
          executions={executions ?? []}
          isLoading={isExecutionsLoading}
          refetchExecutions={refetchTemplateExecutions}
        />
      </Stack>
    </Stack>
  );
}
