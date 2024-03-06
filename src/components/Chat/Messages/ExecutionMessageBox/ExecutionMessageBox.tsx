import Stack from "@mui/material/Stack";

import MessageBoxHeader from "@/components/Chat/Messages/MessageBoxHeader";
import { useAppSelector } from "@/hooks/useStore";
import { Display } from "@/components/Prompt/Common/Display";
import ExecutionMessageFooter from "@/components/Chat/Messages/ExecutionMessageBox/ExecutionMessageFooter";
import ExecutionMessageActions from "@/components/Chat/Messages/ExecutionMessageBox/ExecutionMessageActions";
import ExecutionMessageInstructions from "@/components/Chat/Messages/ExecutionMessageBox/ExecutionMessageInstructions";

interface Props {
  onAbort: () => void;
}

function ExecutionMessageBox({ onAbort }: Props) {
  const { selectedTemplate, selectedChatOption } = useAppSelector(state => state.chat);

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
        <MessageBoxHeader variant="EXECUTION" />

        {selectedChatOption === "QA" && <ExecutionMessageInstructions />}

        <Stack
          position={"relative"}
          mx={"24px"}
          borderRadius={"24px"}
          overflow={"hidden"}
          direction={"column"}
          gap={2}
        >
          <Display templateData={selectedTemplate} />
        </Stack>
        <ExecutionMessageFooter onAbort={onAbort} />
      </Stack>
      <ExecutionMessageActions template={selectedTemplate} />
    </Stack>
  );
}

export default ExecutionMessageBox;
