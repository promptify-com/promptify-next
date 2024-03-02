import { Fragment, useRef } from "react";
import Stack from "@mui/material/Stack";

import useScrollToBottom from "@/components/Prompt/Hooks/useScrollToBottom";

import type { IMessage } from "@/components/Prompt/Types/chat";
import { Message } from "./Message";
import { Templates } from "@/core/api/dto/templates";
import TemplateSuggestions from "@/components/Chat/TemplateSuggestions";
import ChatOptions from "./ChatOptions";
import { useAppSelector } from "@/hooks/useStore";

interface Props {
  messages: IMessage[];
  templates: Templates[];
  onGenerate: () => void;
  showGenerate: boolean;
  isValidating: boolean;
  onAbort?: () => void;
}

const ChatInterface = ({ templates, messages, onGenerate, showGenerate, onAbort, isValidating }: Props) => {
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const selectedTemplate = useAppSelector(state => state.chat.selectedTemplate);

  const { scrollToBottom } = useScrollToBottom({
    ref: messagesContainerRef,
    content: messages,
    isGenerating: false,
  });

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
        <Stack
          gap={3}
          direction={"column"}
        >
          {messages.map(msg => (
            <Fragment key={msg.id}>
              <Message
                message={msg}
                onScrollToBottom={scrollToBottom}
              />
              {msg.type === "suggestedTemplates" && (
                <TemplateSuggestions
                  templates={templates}
                  scrollToBottom={scrollToBottom}
                />
              )}
            </Fragment>
          ))}

          {!!selectedTemplate && <ChatOptions />}
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
