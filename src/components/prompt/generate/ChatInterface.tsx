import { useEffect, useRef, Dispatch, SetStateAction } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";

import { Message } from "./Message";
import { IAnswer, IMessage } from "@/common/types/chat";
import type { UpdatedQuestionTemplate } from "@/core/api/dto/templates";
import { useAppSelector } from "@/hooks/useStore";
import { InputsForm } from "./Inputsform";
interface Props {
  messages: IMessage[];
  onChange: (value: string | File, question: UpdatedQuestionTemplate) => void;
  setIsSimulaitonStreaming: Dispatch<SetStateAction<boolean>>;
  questions: UpdatedQuestionTemplate[];
  answers: IAnswer[];
}

export const ChatInterface = ({ messages, onChange, setIsSimulaitonStreaming, questions, answers }: Props) => {
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const isFullScreen = useAppSelector(state => state.template.isChatFullScreen);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isFullScreen]);

  function getCurrentDateFormatted(): string {
    const currentDate = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return currentDate.toLocaleDateString("en-US", options);
  }

  return (
    <Stack
      ref={messagesContainerRef}
      gap={3}
    >
      <div style={{ marginTop: "auto" }}></div>

      <Stack
        pb={"38px"}
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
          {getCurrentDateFormatted()}
        </Divider>
        {messages.map((msg, index) => (
          <Message
            key={index}
            message={msg}
            setIsSimulaitonStreaming={setIsSimulaitonStreaming}
            onScrollToBottom={scrollToBottom}
          />
        ))}
        <Box>
          <InputsForm
            questions={questions}
            answers={answers}
            onChange={onChange}
          />
        </Box>
      </Stack>
    </Stack>
  );
};
