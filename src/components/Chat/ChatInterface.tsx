import { Fragment, useRef } from "react";
import Stack from "@mui/material/Stack";

import { useAppSelector } from "@/hooks/useStore";
import useScrollToBottom from "@/components/Prompt/Hooks/useScrollToBottom";
import ChatOptions from "@/components/Chat/ChatOptions";
import ChatHeading from "@/components/Chat/ChatHeading";
import RenderMessage from "@/components/Chat/RenderMessage";
import RunButton from "@/components/Chat/RunButton";
import type { IMessage } from "@/components/Prompt/Types/chat";

interface Props {
  messages: IMessage[];
  onGenerate: () => void;
  showGenerateButton: boolean;
  onAbort: () => void;
}

const ChatInterface = ({ messages, onGenerate, showGenerateButton, onAbort }: Props) => {
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const { selectedTemplate, selectedChatOption, selectedChat } = useAppSelector(state => state.chat);
  const isChatHistorySticky = useAppSelector(state => state.sidebar.isChatHistorySticky);

  const { scrollToBottom } = useScrollToBottom({
    ref: messagesContainerRef,
    content: messages,
  });

  const showChatOptions = Boolean(!!selectedTemplate && !selectedChatOption);
  const showRunButton =
    showGenerateButton && selectedChatOption === "QA" && messages[messages.length - 1]?.type !== "readyMessage";

  return (
    <Stack
      ref={messagesContainerRef}
      gap={3}
      p={{ xs: "48px 8px", md: isChatHistorySticky ? "40px 80px" : "40px 300px" }}
      position={"relative"}
      sx={messagesContainerStyle}
    >
      <Stack
        direction={"column"}
        gap={3}
      >
        {!!selectedChat && (
          <ChatHeading
            title={selectedChat.title}
            thumbnail={selectedChat.thumbnail}
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
          {showRunButton && (
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
