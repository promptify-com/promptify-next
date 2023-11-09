import { CardExecution } from "@/components/common/cards/CardExecution";
import { Templates, TemplatesExecutions } from "@/core/api/dto/templates";
import { useGetExecutionsByTemplateQuery } from "@/core/api/executions";
import { setGeneratedExecution, setSelectedExecution, setSparkHashQueryParam } from "@/core/store/executionsSlice";
import { isValidUserFn } from "@/core/store/userSlice";
import useBrowser from "@/hooks/useBrowser";
import { useAppSelector } from "@/hooks/useStore";
import { Stack } from "@mui/material";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { useRouter } from "next/router";
import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

interface ExecutionsProps {
  template: Templates;
  hashedExecution: TemplatesExecutions | null;
}

export const Executions: React.FC<ExecutionsProps> = ({ template, hashedExecution }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const isValidUser = useAppSelector(isValidUserFn);
  const sparkQueryParam = router.query?.spark as string;
  const { replaceHistoryByPathname } = useBrowser();
  const selectedExecution = useAppSelector(state => state.executions.selectedExecution);
  const generatedExecution = useAppSelector(state => state.executions.generatedExecution);
  const sparkHashQueryParam = useAppSelector(state => state.executions.sparkHashQueryParam);
  const isGenerating = useAppSelector(state => state.template.isGenerating);

  useEffect(() => {
    setSparkHashQueryParam((router.query?.hash as string | null) ?? null);
  }, [router.query?.hash]);

  const {
    data: executions,
    isFetching,
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
      setSparkHashQueryParam(null);
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
  }, [isGenerating, generatedExecution]);

  useEffect(() => {
    if (sparkHashQueryParam && hashedExecution) {
      dispatch(setSelectedExecution(hashedExecution));
      replaceHistoryByPathname(`/prompt/${template.slug}`);
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
      handleSelectExecution({ execution: template.example_execution || executions?.[0] || null, resetHash: true });
    }

    if (sparkQueryParam) {
      replaceHistoryByPathname(`/prompt/${template.slug}`);
    }
  }, [executions]);

  return (
    <Stack gap={1}>
      {executions?.map(execution => (
        <CardExecution
          key={execution.id}
          execution={execution}
        />
      ))}
    </Stack>
  );
};
