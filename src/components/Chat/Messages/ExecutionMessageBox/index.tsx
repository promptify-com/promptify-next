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
  allowGenerate?: boolean;
  template?: Templates;
}

function ExecutionMessageBox({ onAbort, executionData, allowGenerate, template }: Props) {
  const { selectedTemplate } = useAppSelector(state => state.chat);
  const { generatedExecution, selectedExecution } = useAppSelector(state => state.executions);

  const executionToShow = allowGenerate ? generatedExecution : executionData || selectedExecution;

  if (!selectedTemplate) {
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
          template={template!}
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
          <Display
            templateData={selectedTemplate}
            execution={executionToShow!}
          />
        </Stack>
        <ExecutionMessageFooter onAbort={onAbort} />
      </Stack>
      <ExecutionMessageActions template={selectedTemplate} />
    </Stack>
  );
}

export default ExecutionMessageBox;
