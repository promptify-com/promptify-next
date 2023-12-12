import React, { useEffect, useRef, Dispatch, SetStateAction } from "react";
import { Box, Divider, Stack, Typography } from "@mui/material";
import { Message } from "./Message";
import { IAnswer, IMessage } from "@/common/types/chat";
import { TemplateDetailsCard } from "../TemplateDetailsCard";
import { Templates } from "@/core/api/dto/templates";
import { useAppSelector } from "@/hooks/useStore";
import { InputsForm } from "./Inputsform";
import { CardExecution } from "@/components/common/cards/CardExecution";
import { IPromptInput } from "@/common/types/prompt";
import { PromptParams, ResOverrides } from "@/core/api/dto/prompts";
import { isDesktopViewPort } from "@/common/helpers";
import { FeedbackActions } from "../FeedbackActions";

interface Props {
  template: Templates;
  messages: IMessage[];
  onChangeInput: (value: string | File, question: IPromptInput) => void;
  onChangeParam: (value: number, param: PromptParams) => void;
  setIsSimulationStreaming: Dispatch<SetStateAction<boolean>>;
  inputs: IPromptInput[];
  answers: IAnswer[];
  params: PromptParams[];
  paramsValues: ResOverrides[];
}

export const ChatInterface = ({
  template,
  messages,
  onChangeInput,
  onChangeParam,
  setIsSimulationStreaming,
  inputs,
  answers,
  params,
  paramsValues,
}: Props) => {
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const isChatFullScreen = useAppSelector(state => state.template.isChatFullScreen);
  const isDesktopView = isDesktopViewPort();

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

      {isChatFullScreen && (
        <TemplateDetailsCard
          template={template}
          min={!isDesktopView}
        />
      )}

      <Stack
        pb={"8px"}
        mx={{ xs: "16px", md: isChatFullScreen ? "40px" : "32px" }}
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
                ml={{ xs: 0, md: isChatFullScreen ? "48px" : 0 }}
                mb={2}
                mt={{ xs: 0, md: msg.noHeader ? -2.5 : 0 }}
              >
                <InputsForm
                  inputs={inputs}
                  params={params}
                  answers={answers}
                  paramsValues={paramsValues}
                  onChangeInput={onChangeInput}
                  onChangeParam={onChangeParam}
                  setIsSimulationStreaming={setIsSimulationStreaming}
                  onScrollToBottom={scrollToBottom}
                />
              </Box>
            )}
            {msg.type === "spark" && msg.spark && (
              <Stack
                mx={{ xs: 0, md: isChatFullScreen ? "48px" : 0 }}
                mb={2}
                gap={2}
              >
                <Box maxWidth={"360px"}>
                  <CardExecution
                    execution={msg.spark}
                    min
                    promptsData={template.prompts}
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
