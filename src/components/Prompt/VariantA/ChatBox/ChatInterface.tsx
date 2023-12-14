import React, { useEffect, useRef } from "react";
import { Box, Divider, Stack, Typography } from "@mui/material";
import { Message } from "./Message";
import { IMessage } from "@/common/types/chat";
import { Templates } from "@/core/api/dto/templates";
import { useAppSelector } from "@/hooks/useStore";
import { InputsForm } from "./InputsForm";
import { IPromptInput } from "@/common/types/prompt";
import { PromptParams } from "@/core/api/dto/prompts";
import { isDesktopViewPort } from "@/common/helpers";
import { FeedbackActions } from "../FeedbackActions";
import { MessageSparkBox } from "./MessageSparkBox";
import { TemplateDetailsCard } from "../../Common/TemplateDetailsCard";

interface Props {
  template: Templates;
  messages: IMessage[];
  onChangeInput: (value: string | File, question: IPromptInput) => void;
  onChangeParam: (value: number, param: PromptParams) => void;
}

export const ChatInterface = ({ template, messages, onChangeInput, onChangeParam }: Props) => {
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const selectedExecution = useAppSelector(state => state.executions.selectedExecution);
  const generatedExecution = useAppSelector(state => state.executions.generatedExecution);

  const isExecutionShown = Boolean(selectedExecution ?? generatedExecution);
  const isDesktopView = isDesktopViewPort();

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isExecutionShown]);

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

      <Box mx={!isDesktopView ? "16px" : "40px"}>
        {!isExecutionShown && (
          <TemplateDetailsCard
            template={template}
            min={!isDesktopView}
          />
        )}
      </Box>

      <Stack
        pb={"8px"}
        mx={{ xs: "16px", md: !isExecutionShown ? "40px" : "32px" }}
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
              isExecutionShown={isExecutionShown}
              message={msg}
              onScrollToBottom={scrollToBottom}
            />
            {msg.type === "form" && (
              <Box
                ml={{ xs: 0, md: !isExecutionShown ? "48px" : 0 }}
                mb={2}
                mt={{ xs: 0, md: msg.noHeader ? -2.5 : 0 }}
              >
                <InputsForm
                  onChangeInput={onChangeInput}
                  onChangeParam={onChangeParam}
                  onScrollToBottom={scrollToBottom}
                />
              </Box>
            )}
            {msg.type === "spark" && msg.spark && (
              <Stack
                mx={{ xs: 0, md: !isExecutionShown ? "48px" : 0 }}
                mb={2}
                gap={2}
              >
                <Box maxWidth={"360px"}>
                  <MessageSparkBox
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
                  <FeedbackActions execution={msg.spark} />
                </Box>
              </Stack>
            )}
          </React.Fragment>
        ))}
      </Stack>
    </Stack>
  );
};
