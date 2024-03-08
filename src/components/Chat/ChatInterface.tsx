import { Fragment, useRef } from "react";
import Stack from "@mui/material/Stack";

import { useAppSelector } from "@/hooks/useStore";
import useScrollToBottom from "@/components/Prompt/Hooks/useScrollToBottom";
import ChatOptions from "@/components/Chat/ChatOptions";
import ChatHeading from "@/components/Chat/ChatHeading";
import RenderMessage from "@/components/Chat/RenderMessage";
import RunButton from "@/components/Chat/RunButton";
import type { Templates } from "@/core/api/dto/templates";
import type { IMessage } from "@/components/Prompt/Types/chat";

interface Props {
  messages: IMessage[];
  templates: Templates[];
  onGenerate: () => void;
  showGenerateButton: boolean;
  onAbort: () => void;
}

const ChatInterface = ({ templates, messages, onGenerate, showGenerateButton, onAbort }: Props) => {
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const { selectedTemplate, selectedChatOption } = useAppSelector(state => state.chat);

  const { scrollToBottom } = useScrollToBottom({
    ref: messagesContainerRef,
    content: messages,
  });

  const showChatOptions = Boolean(!!selectedTemplate && !selectedChatOption);

  return (
    <Stack
      ref={messagesContainerRef}
      gap={3}
      p={{ xs: "48px 8px", md: "40px 300px" }}
      position={"relative"}
      sx={messagesContainerStyle}
    >
      <Stack
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
              <RenderMessage
                message={msg}
                templates={templates}
                onScrollToBottom={scrollToBottom}
                onGenerate={onGenerate}
                onAbort={onAbort}
              />
            </Fragment>
          ))}

          {showChatOptions && <ChatOptions />}
        </Stack>
        <Stack
          direction={"row"}
          justifyContent={"start"}
        >
          {showGenerateButton && selectedChatOption === "QA" && (
            <RunButton
              onClick={() => {
                if (typeof onGenerate === "function") {
                  onGenerate();
                }
              }}
            />
          )}
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
    width: "0px",
  },
};

export default ChatInterface;
