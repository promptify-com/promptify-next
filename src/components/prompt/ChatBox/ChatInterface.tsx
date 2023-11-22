import React, { useEffect, useRef, Dispatch, SetStateAction } from "react";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { Message } from "./Message";
import { IAnswer, IMessage } from "@/common/types/chat";
import { TemplateDetailsCard } from "./TemplateDetailsCard";
import { Templates, TemplatesExecutions } from "@/core/api/dto/templates";
import { useAppSelector } from "@/hooks/useStore";
import { InputsForm } from "./Inputsform";
import { CardExecution } from "@/components/common/cards/CardExecution";
import FeedbackThumbs from "../FeedbackThumbs";
import { Replay } from "@mui/icons-material";
import { IPromptInputQuestion } from "@/common/types/prompt";
import { PromptParams } from "@/core/api/dto/prompts";

interface Props {
  template: Templates;
  messages: IMessage[];
  onChange: (value: string | File, question: IPromptInputQuestion) => void;
  setIsSimulationStreaming: Dispatch<SetStateAction<boolean>>;
  inputs: IPromptInputQuestion[];
  params: PromptParams[];
  answers: IAnswer[];
  regenerate: (execution: TemplatesExecutions) => void;
}

export const ChatInterface = ({
  template,
  messages,
  onChange,
  setIsSimulationStreaming,
  inputs,
  params,
  answers,
  regenerate,
}: Props) => {
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const isChatFullScreen = useAppSelector(state => state.template.isChatFullScreen);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isChatFullScreen]);

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

      {isChatFullScreen && <TemplateDetailsCard template={template} />}

      <Stack
        pb={"8px"}
        mx={isChatFullScreen ? "40px" : "32px"}
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
        {messages.map(msg => (
          <React.Fragment key={msg.id}>
            <Message
              message={msg}
              setIsSimulationStreaming={setIsSimulationStreaming}
              onScrollToBottom={scrollToBottom}
            />
            {msg.type === "form" && (
              <Box
                ml={isChatFullScreen ? "48px" : 0}
                mb={2}
                mt={msg.noHeader ? -2.5 : 0}
              >
                <InputsForm
                  inputs={inputs}
                  params={params}
                  answers={answers}
                  onChange={onChange}
                  setIsSimulationStreaming={setIsSimulationStreaming}
                  onScrollToBottom={scrollToBottom}
                />
              </Box>
            )}
            {msg.type === "spark" && msg.spark && (
              <Stack
                mx={isChatFullScreen ? "48px" : "0"}
                mb={2}
                gap={2}
              >
                <Box maxWidth={"360px"}>
                  <CardExecution
                    execution={msg.spark}
                    min
                  />
                </Box>

                <Box>
                  <Typography
                    fontSize={12}
                    fontWeight={500}
                    color={"onSurface"}
                    mb={"10px"}
                  >
                    Quick Feedback:
                  </Typography>
                  <Stack
                    direction={"row"}
                    alignItems={"center"}
                    flexWrap={"wrap"}
                    gap={1}
                  >
                    <FeedbackThumbs execution={msg.spark} />
                    <Button
                      onClick={() => {
                        if (msg.spark) regenerate(msg.spark);
                      }}
                      variant="text"
                      startIcon={<Replay />}
                      sx={{
                        height: "22px",
                        p: "15px",
                        fontSize: 13,
                        fontWeight: 500,
                        border: "1px solid",
                        borderColor: "divider",
                        color: "secondary.main",
                        ":hover": {
                          bgcolor: "action.hover",
                        },
                      }}
                    >
                      Try again
                    </Button>
                  </Stack>
                </Box>
              </Stack>
            )}
          </React.Fragment>
        ))}
      </Stack>
    </Stack>
  );
};
