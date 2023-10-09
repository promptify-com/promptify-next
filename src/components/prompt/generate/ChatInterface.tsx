import React, { useEffect, useRef, Dispatch, SetStateAction } from "react";
import { Grid } from "@mui/material";

import { Message } from "./Message";
import { IMessage } from "@/common/types/chat";
interface Props {
  messages: IMessage[];
  onChange?: (value: string) => void;
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

  return (
    <Grid
      ref={messagesContainerRef}
      display={"flex"}
      width={"100%"}
      flexDirection={"column"}
      alignItems={"start"}
      pb={"8px"}
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
      {messages.map((msg, idx) => (
        <Message
          key={idx}
          hideHeader={idx === 1}
          message={msg}
          onChangeValue={onChange}
          disabledChoices={isNotLastMessage(msg)}
          setIsSimulaitonStreaming={setIsSimulaitonStreaming}
          onScrollToBottom={scrollToBottom}
        />
      ))}
    </Grid>
  );
};
