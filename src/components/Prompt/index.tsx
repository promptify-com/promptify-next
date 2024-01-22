import { useEffect, type Dispatch, type SetStateAction } from "react";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { isValidUserFn } from "@/core/store/userSlice";
import { useGetExecutionsByTemplateQuery } from "@/core/api/executions";
import { setSelectedExecution, setSparkHashQueryParam } from "@/core/store/executionsSlice";
import type { Templates, TemplatesExecutions } from "@/core/api/dto/templates";
import useVariant from "./Hooks/useVariant";
import lazy from "next/dynamic";

const TemplateVariantALazy = lazy(() => import("@/components/Prompt/VariantA"), { ssr: false });
const TemplateVariantBLazy = lazy(() => import("@/components/Prompt/VariantB"), { ssr: false });

interface Props {
  template: Templates;
  setErrorMessage: Dispatch<SetStateAction<string>>;
  questionPrefixContent: string;
}

function TemplatePage({ template, setErrorMessage, questionPrefixContent }: Props) {
  const dispatch = useAppDispatch();
  const { selectedExecution, sparkHashQueryParam } = useAppSelector(state => state.executions);
  const isValidUser = useAppSelector(isValidUserFn);
  const { variant } = useVariant();
  const { data: executions } = useGetExecutionsByTemplateQuery(isValidUser ? template.id : skipToken);

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
        <TemplateVariantALazy
          executions={executions ?? []}
          template={template}
          questionPrefixContent={questionPrefixContent}
          setErrorMessage={setErrorMessage}
        />
      ) : (
        <TemplateVariantBLazy
          executions={executions ?? []}
          template={template}
          questionPrefixContent={questionPrefixContent}
          setErrorMessage={setErrorMessage}
        />
      )}
    </>
  );
}

export default TemplatePage;
