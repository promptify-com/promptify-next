import { useEffect, type Dispatch, type SetStateAction } from "react";
import { skipToken } from "@reduxjs/toolkit/dist/query";

import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { isValidUserFn } from "@/core/store/userSlice";
import { useGetExecutionsByTemplateQuery } from "@/core/api/executions";
import { setSelectedExecution, setSparkHashQueryParam } from "@/core/store/executionsSlice";
import TemplateVariantA from "@/components/Prompt/VariantA";
import TemplateVariantB from "@/components/Prompt/VariantB";
import type { Templates, TemplatesExecutions } from "@/core/api/dto/templates";

interface TemplateLayoutProps {
  template: Templates;
  setErrorMessage: Dispatch<SetStateAction<string>>;
  questionPrefixContent: string;
  variant: string;
}

export default function TempalteLayout({
  variant,
  template,
  setErrorMessage,
  questionPrefixContent,
}: TemplateLayoutProps) {
  const { selectedExecution, sparkHashQueryParam } = useAppSelector(state => state.executions);

  const dispatch = useAppDispatch();

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
    if (!executions || sparkHashQueryParam) {
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
    <>
      {variant === "a" ? (
        <TemplateVariantA
          executions={executions ?? []}
          template={template}
          questionPrefixContent={questionPrefixContent}
          setErrorMessage={setErrorMessage}
          isExecutionsLoading={isExecutionsLoading}
          refetchTemplateExecutions={refetchTemplateExecutions}
        />
      ) : (
        <TemplateVariantB
          executions={executions ?? []}
          template={template}
          questionPrefixContent={questionPrefixContent}
          setErrorMessage={setErrorMessage}
          isExecutionsLoading={isExecutionsLoading}
          refetchTemplateExecutions={refetchTemplateExecutions}
        />
      )}
    </>
  );
}
