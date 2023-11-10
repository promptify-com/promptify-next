import React, { useEffect, useRef, Dispatch, SetStateAction } from "react";
import { Divider, Grid, Stack } from "@mui/material";

import { Message } from "./Message";
import { IMessage } from "@/common/types/chat";
interface Props {
  messages: IMessage[];
  onChange: (value: string | File) => void;
  setIsSimulaitonStreaming: Dispatch<SetStateAction<boolean>>;
}

export const ChatInterface = ({ messages, onChange, setIsSimulaitonStreaming }: Props) => {
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

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
  );
};
