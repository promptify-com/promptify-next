import Stack from "@mui/material/Stack";
import Fade from "@mui/material/Fade";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setIsSimulationStreaming, initialState as initialChatState } from "@/core/store/chatSlice";
import TemplateSuggestions from "@/components/Chat/Messages/TemplateSuggestions";
import FormMessageBox from "@/components/Chat/Messages/FormMessageBox";
import ExecutionMessageBox from "@/components/Chat/Messages/ExecutionMessageBox";
import TemplateMessage from "@/components/Chat/Messages/templateMessage";
import QuestionMessage from "@/components/Chat/Messages/QuestionMessage";
import TextMessage from "@/components/Chat/Messages/TextMessage";
import ReadyMessage from "@/components/Chat/Messages/ReadyMessage";
import HtmlMessage from "@/components/Chat/Messages/HtmlMessage";
import type { IMessage } from "@/components/Prompt/Types/chat";
import WorkflowSuggestions from "./Messages/WorkflowSuggestions";
import CredentialsMessage from "./Messages/CredentialsMessage";
import { createMessage } from "./helper";
import Box from "@mui/material/Box";
import { initialState as initialExecutionsState } from "@/core/store/executionsSlice";

interface Props {
  message: IMessage;
  onScrollToBottom: (force?: boolean) => void;
  onGenerate: () => void;
  onAbort: () => void;
  onExecuteWorkflow?: () => void;
}

function RenderMessage({ message, onScrollToBottom, onGenerate, onAbort, onExecuteWorkflow }: Props) {
  const dispatch = useAppDispatch();
  const generatedExecution = useAppSelector(
    state => state.executions?.generatedExecution ?? initialExecutionsState.generatedExecution,
  );
  const areCredentialsStored = useAppSelector(
    state => state.chat?.areCredentialsStored ?? initialChatState.areCredentialsStored,
  );
  const generatedExecutionMessage: IMessage = createMessage({
    type: "html",
    text: generatedExecution?.data?.map(promptExec => promptExec.message).join(" ") ?? "",
  });

  return (
    <>
      {message.type === "text" && (
        <TextMessage
          message={message}
          onScrollToBottom={onScrollToBottom}
        />
      )}

      {message.type === "html" && <HtmlMessage message={message} />}

      {message.type === "templates_suggestion" && !!message.data?.length && (
        <Fade
          in={true}
          unmountOnExit
          timeout={800}
          onTransitionEnd={() => dispatch(setIsSimulationStreaming(false))}
        >
          <Stack>
            <TemplateSuggestions
              message={message}
              scrollToBottom={onScrollToBottom}
            />
          </Stack>
        </Fade>
      )}

      {message.type === "workflows_suggestion" && !!message.data?.length && (
        <Fade
          in={true}
          unmountOnExit
          timeout={800}
          onTransitionEnd={() => dispatch(setIsSimulationStreaming(false))}
        >
          <Stack>
            <WorkflowSuggestions
              message={message}
              scrollToBottom={onScrollToBottom}
            />
          </Stack>
        </Fade>
      )}
      {message.type === "form" && (
        <Fade
          in={true}
          unmountOnExit
          timeout={800}
          onTransitionEnd={() => dispatch(setIsSimulationStreaming(false))}
        >
          <Stack>
            <FormMessageBox
              content={message.text}
              template={message.template!}
              onGenerate={onGenerate}
              onScrollToBottom={onScrollToBottom}
            />
          </Stack>
        </Fade>
      )}

      {message.type === "credsForm" && areCredentialsStored && (
        <Box mt={-4}>
          <CredentialsMessage
            message={message}
            onExecuteWorkflow={onExecuteWorkflow}
            showRunButton
          />
        </Box>
      )}
      {message.type === "credentials" && !areCredentialsStored && (
        <Box mt={-4}>
          <CredentialsMessage
            message={message}
            onExecuteWorkflow={onExecuteWorkflow}
          />
        </Box>
      )}
      {message.type === "template" && (
        <Fade
          in={true}
          unmountOnExit
          timeout={800}
          onTransitionEnd={() => dispatch(setIsSimulationStreaming(false))}
        >
          <Stack>
            <TemplateMessage
              template={message.template!}
              content={message.text}
              onScrollToBottom={onScrollToBottom}
            />
          </Stack>
        </Fade>
      )}
      {message.type === "questionInput" && (
        <QuestionMessage
          variant="input"
          message={message}
        />
      )}
      {message.type === "questionParam" && (
        <QuestionMessage
          variant="param"
          message={message}
        />
      )}
      {message.type === "spark" && (
        <Fade
          in={true}
          unmountOnExit
          timeout={800}
          onTransitionEnd={() => dispatch(setIsSimulationStreaming(false))}
        >
          <Stack>
            <ExecutionMessageBox
              onAbort={onAbort}
              executionId={message.executionId!}
              executionData={message.spark}
              isLastExecution={message.isLatestExecution}
              template={message.template}
            />
          </Stack>
        </Fade>
      )}
      {message.type === "readyMessage" && (
        <ReadyMessage
          content={message.text}
          onGenerate={onGenerate}
        />
      )}
      {message.type === "workflowExecution" && <HtmlMessage message={generatedExecutionMessage} />}
    </>
  );
}

export default RenderMessage;
