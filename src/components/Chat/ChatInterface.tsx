import { Fragment, useRef } from "react";
import Stack from "@mui/material/Stack";

import { useAppSelector } from "@/hooks/useStore";
import useScrollToBottom from "@/components/Prompt/Hooks/useScrollToBottom";
import ChatOptions from "@/components/Chat/ChatOptions";
import ChatHeading from "@/components/Chat/ChatHeading";
import RenderMessage from "@/components/Chat/RenderMessage";
import Button from "@mui/material/Button";
import ArrowCircleUp from "@/assets/icons/ArrowCircleUp";
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
          {showGenerateButton && (
            <Button
              variant="text"
              sx={{
                bgcolor: "primary.main",
                color: "onPrimary",
                border: "none",
                "&:hover": {
                  bgcolor: "primary.main",
                  opacity: 0.9,
                },
                ":disabled": {
                  bgcolor: "surface.5",
                  cursor: "not-allowed",
                },
              }}
              endIcon={<ArrowCircleUp />}
              onClick={() => {
                if (typeof onGenerate === "function") {
                  onGenerate();
                }
              }}
            >
              Start
            </Button>
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
