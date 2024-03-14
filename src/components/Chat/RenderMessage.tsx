import Stack from "@mui/material/Stack";
import Fade from "@mui/material/Fade";

import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setIsSimulationStreaming } from "@/core/store/chatSlice";
import TemplateSuggestions from "./Messages/TemplateSuggestions";
import FormMessageBox from "@/components/Chat/Messages/FormMessageBox";
import ExecutionMessageBox from "@/components/Chat/Messages/ExecutionMessageBox";
import HeaderWithTextMessage from "@/components/Chat/Messages/HeaderWithTextMessage";
import QuestionMessage from "@/components/Chat/Messages/QuestionMessage";
import TextMessage from "@/components/Chat/Messages/TextMessage";
import type { IMessage } from "../Prompt/Types/chat";
import ReadyMessage from "./Messages/ReadyMessage";

interface Props {
  message: IMessage;
  onScrollToBottom: () => void;
  onGenerate: () => void;
  onAbort: () => void;
}

function RenderMessage({ message, onScrollToBottom, onGenerate, onAbort }: Props) {
  const dispatch = useAppDispatch();
  const selectedTemplate = useAppSelector(state => state.chat.selectedTemplate);
  return (
    <>
      {message.type === "text" && (
        <TextMessage
          message={message}
          onScrollToBottom={onScrollToBottom}
        />
      )}

      {message.type === "suggestedTemplates" && !!message.templates?.length && (
        <Fade
          in={true}
          unmountOnExit
          timeout={800}
          onTransitionEnd={() => dispatch(setIsSimulationStreaming(false))}
        >
          <Stack>
            <TemplateSuggestions
              content={message.text}
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
              template={selectedTemplate!}
              onGenerate={onGenerate}
              onScrollToBottom={onScrollToBottom}
            />
          </Stack>
        </Fade>
      )}
      {message.type === "headerWithText" && (
        <Fade
          in={true}
          unmountOnExit
          timeout={800}
          onTransitionEnd={() => dispatch(setIsSimulationStreaming(false))}
        >
          <Stack>
            <HeaderWithTextMessage
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
            <ExecutionMessageBox onAbort={onAbort} />
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
