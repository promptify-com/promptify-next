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
import type { Templates } from "@/core/api/dto/templates";
import type { IMessage } from "../Prompt/Types/chat";

interface Props {
  message: IMessage;
  onScrollToBottom: () => void;
  templates: Templates[];
  onGenerate: () => void;
  onAbort: () => void;
}

function RenderMessage({ message, onScrollToBottom, templates, onGenerate, onAbort }: Props) {
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

      {message.type === "suggestedTemplates" && (
        <Fade
          in={true}
          unmountOnExit
          timeout={800}
          onTransitionEnd={() => dispatch(setIsSimulationStreaming(false))}
        >
          <Stack>
            <TemplateSuggestions
              content={message.text}
              templates={templates}
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
            />
          </Stack>
        </Fade>
      )}
      {message.type === "HeaderWithText" && (
        <Fade
          in={true}
          unmountOnExit
          timeout={800}
          onTransitionEnd={() => dispatch(setIsSimulationStreaming(false))}
        >
          <Stack>
            <HeaderWithTextMessage content={message.text} />
          </Stack>
        </Fade>
      )}
      {message.type === "question" && (
        <QuestionMessage
          index={message.questionIndex!}
          content={message.text}
          isRequired={message.isRequired!}
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
    </>
  );
}

export default RenderMessage;
