import { useEffect, useRef, Dispatch, SetStateAction, Fragment } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";

import { Message } from "./Message";
import { IAnswer, IMessage } from "@/common/types/chat";
import type { UpdatedQuestionTemplate } from "@/core/api/dto/templates";
import { InputsForm } from "./Inputsform";

interface Props {
  messages: IMessage[];
  onChange: (value: string | File, question: UpdatedQuestionTemplate) => void;
  setIsSimulaitonStreaming: Dispatch<SetStateAction<boolean>>;
  questions: UpdatedQuestionTemplate[];
  answers: IAnswer[];
  onGenerate: () => void;
  onAbort: () => void;
}

export const ChatInterface = ({
  messages,
  onChange,
  setIsSimulaitonStreaming,
  questions,
  answers,
  onGenerate,
  onAbort,
}: Props) => {
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

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

  const lastFormMessage = messages
    .slice()
    .reverse()
    .find(msg => msg.type === "form");

  return (
    <Stack
      mt={2}
      ref={messagesContainerRef}
      position={"relative"}
    >
      <div style={{ marginTop: "auto" }}></div>

      <Stack pb={"38px"}>
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
        {messages.map(msg => (
          <Fragment key={msg.id}>
            <Message
              message={msg}
              setIsSimulaitonStreaming={setIsSimulaitonStreaming}
              onScrollToBottom={scrollToBottom}
            />
            {msg.type === "form" && msg.id === lastFormMessage?.id && (
              <Box>
                <InputsForm
                  abortGenerating={onAbort}
                  questions={questions}
                  answers={answers}
                  onChange={onChange}
                  onGenerate={onGenerate}
                />
              </Box>
            )}
          </Fragment>
        ))}
      </Stack>
    </Stack>
  );
};
