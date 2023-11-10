import React, { useEffect, useRef, Dispatch, SetStateAction } from "react";
import { Divider, Grid, Stack } from "@mui/material";

import { Message } from "./Message";
import { IMessage } from "@/common/types/chat";
import { TemplateDetailsCard } from "./TemplateDetailsCard";
import { Templates } from "@/core/api/dto/templates";
import { useAppSelector } from "@/hooks/useStore";
interface Props {
  template: Templates;
  messages: IMessage[];
  onChange: (value: string | File) => void;
  setIsSimulaitonStreaming: Dispatch<SetStateAction<boolean>>;
}

export const ChatInterface = ({ template, messages, onChange, setIsSimulaitonStreaming }: Props) => {
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const isFullScreen = useAppSelector(state => state.template.isChatFullScreen);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const isNotLastMessage = (message: IMessage) => {
    return message.type === "choices" && message !== messages[messages.length - 1];
  };

  const lastMessage = messages[messages.length - 1];

  return (
    <Stack
      ref={messagesContainerRef}
      gap={3}
      sx={{
        overflow: "auto",
        overscrollBehavior: "contain",
        "&::-webkit-scrollbar": {
          width: "6px",
          p: 1,
          backgroundColor: "surface.5",
        },
        "&::-webkit-scrollbar-track": {
          webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "surface.1",
          outline: "1px solid surface.1",
          borderRadius: "10px",
        },
      }}
    >
      <div style={{ marginTop: "auto" }}></div>

      {isFullScreen && <TemplateDetailsCard template={template} />}

      <Stack
        pb={"8px"}
        mx={"40px"}
      >
        <Divider
          sx={{
            fontSize: 12,
            fontWeight: 400,
            color: "onSurface",
            opacity: 0.5,
          }}
        >
          New messages
        </Divider>
        {messages.map((msg, idx) => (
          <Message
            key={idx}
            hideHeader={idx === 1}
            message={msg}
            onChangeValue={onChange}
            disabledChoices={isNotLastMessage(msg)}
            setIsSimulaitonStreaming={setIsSimulaitonStreaming}
            onScrollToBottom={scrollToBottom}
            lastMessage={lastMessage}
          />
        ))}
      </Stack>
    </Stack>
  );
};
