import { Fragment, useRef } from "react";
import Stack from "@mui/material/Stack";

import useScrollToBottom from "@/components/Prompt/Hooks/useScrollToBottom";
import Message from "@/components/Chat/Message";
import TemplateSuggestions from "@/components/Chat/TemplateSuggestions";
import ChatOptions from "@/components/Chat/ChatOptions";
import ChatHeading from "@/components/Chat/ChatHeading";
import FormMessageBox from "@/components/Chat/FormMessageBox";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import type { Templates } from "@/core/api/dto/templates";
import type { IMessage } from "@/components/Prompt/Types/chat";
import { Fade } from "@mui/material";
import { setIsSimulationStreaming } from "@/core/store/chatSlice";

interface Props {
  messages: IMessage[];
  templates: Templates[];
  onGenerate: () => void;
  showGenerate: boolean;
  isValidating: boolean;
  onAbort?: () => void;
}

const ChatInterface = ({ templates, messages, onGenerate, showGenerate, onAbort, isValidating }: Props) => {
  const dispatch = useAppDispatch();
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const { selectedTemplate, selectedChatOption } = useAppSelector(state => state.chat);
  const currentUser = useAppSelector(state => state.user.currentUser);
  const isGenerating = useAppSelector(state => state.template.isGenerating);

  const { scrollToBottom } = useScrollToBottom({
    ref: messagesContainerRef,
    content: messages,
    isGenerating: false,
  });

  const showChatOptions = Boolean(!!selectedTemplate && !selectedChatOption);

  return (
    <Stack
      ref={messagesContainerRef}
      gap={3}
      position={"relative"}
      sx={messagesContainerStyle}
    >
      <Stack
        pt={{ md: "38px" }}
        direction={"column"}
        gap={3}
      >
        {!!selectedTemplate && (
          <ChatHeading
            title={selectedTemplate.title}
            avatar={selectedTemplate.thumbnail}
          />
        )}

        <Stack
          direction={"column"}
          gap={3}
        >
          {messages.map(msg => (
            <Fragment key={msg.id}>
              <Message
                message={msg}
                onScrollToBottom={scrollToBottom}
              />
              {msg.type === "suggestedTemplates" && (
                <Fade
                  in={true}
                  unmountOnExit
                  timeout={800}
                  onTransitionEnd={() => dispatch(setIsSimulationStreaming(false))}
                >
                  <Stack>
                    <TemplateSuggestions
                      content={msg.text}
                      templates={templates}
                      scrollToBottom={scrollToBottom}
                    />
                  </Stack>
                </Fade>
              )}
              {msg.type === "form" && (
                <Fade
                  in={true}
                  unmountOnExit
                  timeout={800}
                  onTransitionEnd={() => dispatch(setIsSimulationStreaming(false))}
                >
                  <Stack>
                    <FormMessageBox content={msg.text} />
                  </Stack>
                </Fade>
              )}
            </Fragment>
          ))}

          {showChatOptions && <ChatOptions />}
        </Stack>
      </Stack>
    </Stack>
  );
};

const messagesContainerStyle = {
  overflowY: "auto",
  overflowX: "hidden",
  px: "8px",
  overscrollBehavior: "contain",
  scrollBehavior: "smooth",
  "&::-webkit-scrollbar": {
    width: { xs: "4px", md: "6px" },
    p: 1,
    backgroundColor: "surface.1",
  },
  "&::-webkit-scrollbar-track": {
    webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "surface.5",
    outline: "1px solid surface.1",
    borderRadius: "10px",
  },
};

export default ChatInterface;
