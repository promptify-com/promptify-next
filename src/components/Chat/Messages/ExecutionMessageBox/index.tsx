import Stack from "@mui/material/Stack";

import MessageBoxHeader from "@/components/Chat/Messages/MessageBoxHeader";
import { useAppSelector } from "@/hooks/useStore";
import { Display } from "@/components/Prompt/Common/Display";
import ExecutionMessageFooter from "@/components/Chat/Messages/ExecutionMessageBox/ExecutionMessageFooter";
import ExecutionMessageActions from "@/components/Chat/Messages/ExecutionMessageBox/ExecutionMessageActions";
import type { Templates, TemplatesExecutions } from "@/core/api/dto/templates";

interface Props {
  onAbort: () => void;
  executionData?: TemplatesExecutions;
  isLastExecution?: boolean;
  template?: Templates;
  executionId: number;
}

function ExecutionMessageBox({ onAbort, executionData, isLastExecution, template, executionId }: Props) {
  const generatedExecution = useAppSelector(state => state.executions.generatedExecution);

  if (!template) {
    return;
  }
  return (
    <Stack
      direction={"column"}
      gap={1}
    >
      <Stack
        bgcolor={"surface.2"}
        borderRadius={"24px"}
      >
        <MessageBoxHeader
          template={template}
          variant="EXECUTION"
        />

        <Stack
          position={"relative"}
          mx={{ xs: "8px", md: "24px" }}
          borderRadius={"24px"}
          overflow={"hidden"}
          direction={"column"}
          gap={2}
        >
          {isLastExecution ? (
            <Display
              isLastExecution={true}
              templateData={template}
              execution={generatedExecution!}
            />
          ) : (
            <Display
              isLastExecution={false}
              templateData={template}
              execution={executionData!}
            />
          )}
        </Stack>
        <ExecutionMessageFooter
          onAbort={onAbort}
          isLastExecution={isLastExecution}
        />
      </Stack>
      <ExecutionMessageActions
        template={template}
        execution={executionData}
      />
    </Stack>
  );
}

export default ExecutionMessageBox;
