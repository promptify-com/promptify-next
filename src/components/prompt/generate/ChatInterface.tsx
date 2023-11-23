import { useRef, Dispatch, SetStateAction, Fragment, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";

import { Message } from "./Message";
import { IAnswer, IMessage } from "@/common/types/chat";
import type { Templates, UpdatedQuestionTemplate } from "@/core/api/dto/templates";
import { AccordionMessage } from "./AccordionMessage";
import { useAppSelector } from "@/hooks/useStore";
import { TemplateDetailsCard } from "./TemplateDetailsCard";
import { IPromptInput } from "@/common/types/prompt";
import Typography from "@mui/material/Typography";
import { timeAgo } from "@/common/helpers/timeManipulation";

interface Props {
  template: Templates;
  messages: IMessage[];
  onChange: (value: string | File, input: IPromptInput) => void;
  setIsSimulaitonStreaming: Dispatch<SetStateAction<boolean>>;
  inputs: IPromptInput[];
  answers: IAnswer[];
  onGenerate: () => void;
  onAbort: () => void;
  onClear: () => void;
  showGenerate: boolean;
  setMessages: Dispatch<SetStateAction<IMessage[]>>;
}

export const ChatInterface = ({
  template,
  messages,
  onChange,
  setIsSimulaitonStreaming,
  inputs,
  answers,
  onGenerate,
  showGenerate,
  onAbort,
  onClear,
  setMessages,
}: Props) => {
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const isGenerating = useAppSelector(state => state.template.isGenerating);
  const [isHovered, setIsHovered] = useState(false);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight + 140;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

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
      ref={messagesContainerRef}
      gap={3}
      mx={"40px"}
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

      <TemplateDetailsCard template={template} />

      <Stack
        pb={"38px"}
        direction={"column"}
        gap={3}
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

        {messages.map(msg => (
          <Fragment key={msg.id}>
            <Message
              message={msg}
              setIsSimulaitonStreaming={setIsSimulaitonStreaming}
              onScrollToBottom={scrollToBottom}
            />
            {msg.type === "form" && msg.id === lastFormMessage?.id && (
              <Box
                position={"relative"}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {isHovered && (
                  <Typography
                    sx={{
                      position: "absolute",
                      top: -20,
                      opacity: 0.5,
                      left: 2,
                      zIndex: 999,
                    }}
                    fontSize={12}
                    variant="caption"
                  >
                    Promptify - {timeAgo(msg.createdAt)}
                  </Typography>
                )}
                <AccordionMessage
                  onClear={onClear}
                  template={template}
                  setMessages={setMessages}
                  showGenerate={showGenerate}
                  abortGenerating={onAbort}
                  inputs={inputs}
                  answers={answers}
                  onChange={onChange}
                  onGenerate={onGenerate}
                  onScrollToBottom={scrollToBottom}
                  setIsSimulationStreaming={setIsSimulaitonStreaming}
                />
              </Box>
            )}
          </Fragment>
        ))}
      </Stack>
    </Stack>
  );
};
