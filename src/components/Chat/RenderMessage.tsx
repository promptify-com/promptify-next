import Stack from "@mui/material/Stack";
import Fade from "@mui/material/Fade";

import { useAppDispatch } from "@/hooks/useStore";
import { setIsSimulationStreaming } from "@/core/store/chatSlice";
import TemplateSuggestions from "@/components/Chat/Messages/TemplateSuggestions";
import FormMessageBox from "@/components/Chat/Messages/FormMessageBox";
import ExecutionMessageBox from "@/components/Chat/Messages/ExecutionMessageBox";
import TemplateMessage from "@/components/Chat/Messages/templateMessage";
import QuestionMessage from "@/components/Chat/Messages/QuestionMessage";
import TextMessage from "@/components/Chat/Messages/TextMessage";
import ReadyMessage from "@/components/Chat/Messages/ReadyMessage";
import HtmlMessage from "@/components/Chat/Messages/HtmlMessage";
import type { IMessage } from "@/components/Prompt/Types/chat";

interface Props {
  message: IMessage;
  onScrollToBottom: (force?: boolean) => void;
  onGenerate: () => void;
  onAbort: () => void;
}

function RenderMessage({ message, onScrollToBottom, onGenerate, onAbort }: Props) {
  const dispatch = useAppDispatch();
  return (
    <>
      {message.type === "text" && (
        <TextMessage
          message={message}
          onScrollToBottom={onScrollToBottom}
        />
      )}

      {message.type === "html" && <HtmlMessage message={message} />}

      {message.type === "suggestion" && !!message.templates?.length && (
        <Fade
          in={true}
          unmountOnExit
          timeout={800}
          onTransitionEnd={() => dispatch(setIsSimulationStreaming(false))}
        >
          <Stack>
            <TemplateSuggestions
              templates={message.templates}
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
    </>
  );
}

export default RenderMessage;
