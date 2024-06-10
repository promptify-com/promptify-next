import { useRef } from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

import { useAppSelector } from "@/hooks/useStore";

import useScrollToBottom from "@/components/Prompt/Hooks/useScrollToBottom";
import { ExecutionMessage } from "@/components/Automation/ExecutionMessage";
import ScrollDownButton from "@/components/common/buttons/ScrollDownButton";

import { initialState as initialChatState } from "@/core/store/chatSlice";
import Message from "./Message";
import MessageInputs from "./MessageInputs";
import CredentialsContainer from "./CredentialsContainer";
import RunButton from "@/components/GPT/RunButton";
import type { IMessage, MessageType } from "@/components/Prompt/Types/chat";
import type { ITemplateWorkflow } from "../Automation/types";
import ChatCredentialsPlaceholder from "./ChatCredentialsPlaceholder";

interface Props {
  messages: IMessage[];
  onGenerate: () => void;
  showGenerate: boolean;
  isExecuting: boolean;
  processData: (skipInitialMessages?: boolean) => Promise<void>;
  workflow: ITemplateWorkflow;
}

function NoScheduleGPTChat({ messages, onGenerate, showGenerate, isExecuting, workflow }: Props) {
  const isGenerating = useAppSelector(state => state.templates?.isGenerating ?? false);
  const currentUser = useAppSelector(state => state.user?.currentUser ?? null);
  const generatedExecution = useAppSelector(state => state.executions?.generatedExecution ?? null);
  const { inputs = [], areCredentialsStored } = useAppSelector(state => state.chat ?? initialChatState);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const { showScrollDown, scrollToBottom } = useScrollToBottom({
    ref: messagesContainerRef,
    content: messages,
  });

  const hasInputs = inputs.length > 0;
  const allowNoInputsRun =
    !hasInputs && areCredentialsStored && showGenerate && currentUser?.id && !isGenerating && !isExecuting;

  function showForm(messageType: MessageType): boolean {
    return Boolean((messageType === "credentials" && !areCredentialsStored) || (messageType === "form" && hasInputs));
  }

  return (
    <Stack
      ref={messagesContainerRef}
      gap={3}
      mx={{ xs: "16px", md: "40px" }}
      position={"relative"}
    >
      {showScrollDown && isGenerating && <ScrollDownButton onClick={scrollToBottom} />}

      <Stack
        pb={{ md: "38px" }}
        direction={"column"}
        gap={3}
      >
        <Stack
          mt={6}
          gap={3}
          direction={"column"}
          width={"100%"}
        >
          {!!messages.length ? (
            messages.map(msg => (
              <Box
                key={msg.id}
                sx={{
                  ...(!msg.fromUser && {
                    mr: { md: "56px" },
                  }),
                  ...(msg.fromUser && {
                    ml: { md: "56px" },
                  }),
                }}
              >
                {msg.type === "text" && (
                  <Message
                    isInitialMessage={messages[0] === msg}
                    message={msg}
                  />
                )}
                {msg.type === "html" && <Message message={msg} />}

                {showForm(msg.type) && msg.type === "form" && (
                  <MessageInputs
                    allowGenerate={Boolean(showGenerate || allowNoInputsRun)}
                    onGenerate={onGenerate}
                    message={msg}
                    isExecuting={isExecuting}
                  />
                )}

                {msg.type === "credentials" && (
                  <CredentialsContainer
                    message={"Insert your credentials:"}
                    workflow={workflow}
                  />
                )}
              </Box>
            ))
          ) : (
            <ChatCredentialsPlaceholder />
          )}
          {allowNoInputsRun && (
            <Stack
              alignItems={"start"}
              justifyContent={"start"}
            >
              <RunButton onClick={onGenerate} />
            </Stack>
          )}
          {generatedExecution && <ExecutionMessage execution={generatedExecution} />}
        </Stack>
      </Stack>
    </Stack>
  );
}

export default NoScheduleGPTChat;
