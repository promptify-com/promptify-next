import { CardExecution } from "@/components/common/cards/CardExecution";
import { CardExecutionPlaceholder } from "@/components/placeholders/CardExecutionPlaceholder";
import { Templates, TemplatesExecutions } from "@/core/api/dto/templates";
import { useGetExecutionsByTemplateQuery } from "@/core/api/executions";
import { setGeneratedExecution, setSelectedExecution, setSparkHashQueryParam } from "@/core/store/executionsSlice";
import { isValidUserFn } from "@/core/store/userSlice";
import { useAppSelector } from "@/hooks/useStore";
import { Stack, Typography } from "@mui/material";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

interface ExecutionsProps {
  template: Templates;
}

export const Executions: React.FC<ExecutionsProps> = ({ template }) => {
  const dispatch = useDispatch();
  const isValidUser = useAppSelector(isValidUserFn);
  const selectedExecution = useAppSelector(state => state.executions.selectedExecution);
  const generatedExecution = useAppSelector(state => state.executions.generatedExecution);
  const isGenerating = useAppSelector(state => state.template.isGenerating);

  const {
    data: executions,
    isLoading,
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
      gap={2}
      sx={{
        p: "24px",
      }}
    >
      {isLoading ? (
        Array.from({ length: 2 }, _ => <CardExecutionPlaceholder />)
      ) : executions && executions.length > 0 ? (
        executions.map(execution => (
          <CardExecution
            key={execution.id}
            execution={execution}
          />
        ))
      ) : (
        <Typography>No sparks found</Typography>
      )}
    </Stack>
  );
};
