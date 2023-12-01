import { useRef, Dispatch, SetStateAction, Fragment, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";

import { Message } from "./Message";
import { IAnswer, IMessage } from "@/common/types/chat";
import type { Templates } from "@/core/api/dto/templates";
import { AccordionMessage } from "./AccordionMessage";
import { useAppSelector } from "@/hooks/useStore";
import { TemplateDetailsCard } from "./TemplateDetailsCard";
import { IPromptInput } from "@/common/types/prompt";
import Typography from "@mui/material/Typography";
import { timeAgo } from "@/common/helpers/timeManipulation";
import { PromptParams, ResOverrides } from "@/core/api/dto/prompts";

interface Props {
  template: Templates;
  messages: IMessage[];
  onChangeInput: (value: string | File, input: IPromptInput) => void;
  onChangeParam: (value: number, param: PromptParams) => void;
  setIsSimulationStreaming: Dispatch<SetStateAction<boolean>>;
  inputs: IPromptInput[];
  answers: IAnswer[];
  params: PromptParams[];
  paramsValues: ResOverrides[];
  onGenerate: () => void;
  onAbort: () => void;
  onClear: () => void;
  showGenerate: boolean;
}

export const ChatInterface = ({
  template,
  messages,
  onChangeInput,
  onChangeParam,
  setIsSimulationStreaming,
  inputs,
  answers,
  onGenerate,
  showGenerate,
  onAbort,
  onClear,
  params,
  paramsValues,
}: Props) => {
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const isGenerating = useAppSelector(state => state.template.isGenerating);
  const [isHovered, setIsHovered] = useState(false);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight - 300;
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
      mx={{ md: "40px" }}
      sx={{
        overflow: "auto",
        px: "16px",
        overscrollBehavior: "contain",
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
      }}
    >
      <TemplateDetailsCard template={template} />

      <Stack
        pb={{ md: "38px" }}
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
              setIsSimulationStreaming={setIsSimulationStreaming}
              onScrollToBottom={scrollToBottom}
            />
            {msg.type === "form" && msg.id === lastFormMessage?.id && (
              <Box
                id="accordion-header"
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
                    Promptify {timeAgo(msg.createdAt)}
                  </Typography>
                )}
                <AccordionMessage
                  onClear={onClear}
                  template={template}
                  showGenerate={showGenerate}
                  abortGenerating={onAbort}
                  inputs={inputs}
                  params={params}
                  paramsValues={paramsValues}
                  answers={answers}
                  onChangeInput={onChangeInput}
                  onChangeParam={onChangeParam}
                  onGenerate={onGenerate}
                  setIsSimulationStreaming={setIsSimulationStreaming}
                />
              </Box>
            )}
          </Fragment>
        ))}
      </Stack>
    </Stack>
  );
};
