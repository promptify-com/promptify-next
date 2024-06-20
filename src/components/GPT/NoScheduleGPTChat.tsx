import { useEffect } from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { useAppSelector } from "@/hooks/useStore";
import { ExecutionMessage } from "@/components/Automation/ExecutionMessage";
import { initialState as initialChatState } from "@/core/store/chatSlice";
import Message from "./Message";
import MessageInputs from "./MessageInputs";
import CredentialsContainer from "./CredentialsContainer";
import RunButton from "@/components/GPT/RunButton";
import type { IMessage, MessageType } from "@/components/Prompt/Types/chat";
import type { ITemplateWorkflow, IWorkflowCreateResponse } from "@/components/Automation/types";
import ChatCredentialsPlaceholder from "./ChatCredentialsPlaceholder";
import { useScrollToElement } from "@/hooks/useScrollToElement";

interface Props {
  messages: IMessage[];
  onGenerate: () => void;
  retryRunWorkflow: (executionWorkflow: IWorkflowCreateResponse) => void;
  showGenerate: boolean;
  processData: (skipInitialMessages?: boolean) => Promise<void>;
  workflow: ITemplateWorkflow;
}

function NoScheduleGPTChat({ messages, onGenerate, retryRunWorkflow, showGenerate, workflow }: Props) {
  const isGenerating = useAppSelector(state => state.templates?.isGenerating ?? false);
  const currentUser = useAppSelector(state => state.user?.currentUser ?? null);
  const generatedExecution = useAppSelector(state => state.executions?.generatedExecution ?? null);
  const { inputs = [], areCredentialsStored } = useAppSelector(state => state.chat ?? initialChatState);

  const scrollTo = useScrollToElement("smooth");

  const scrollToBottom = () => {
    scrollTo("#scroll_ref");
  };

  useEffect(() => {
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  }, [messages, generatedExecution]);

  const hasInputs = inputs.length > 0;
  const allowNoInputsRun = !hasInputs && areCredentialsStored && showGenerate && currentUser?.id && !isGenerating;

  function showForm(messageType: MessageType): boolean {
    return Boolean((messageType === "credentials" && !areCredentialsStored) || (messageType === "form" && hasInputs));
  }

  return (
    <Stack
      gap={3}
      mx={{ xs: "16px", md: "40px" }}
      position={"relative"}
    >
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
            messages.map((msg, idx) => (
              <Box key={msg.id}>
                {!generatedExecution && idx === messages.length - 1 && <div id="scroll_ref"></div>}

                {msg.type === "text" && (
                  <Message
                    isInitialMessage={idx === 0}
                    message={msg}
                  />
                )}
                {msg.type === "workflowExecution" && (
                  <Message
                    message={msg}
                    retryExecution={() => retryRunWorkflow(msg.data as IWorkflowCreateResponse)}
                  />
                )}

                {showForm(msg.type) && msg.type === "form" && (
                  <MessageInputs
                    allowGenerate={Boolean(showGenerate || allowNoInputsRun)}
                    onGenerate={onGenerate}
                    message={msg}
                    isExecuting={isGenerating}
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
              <RunButton
                onClick={onGenerate}
                showIcon
                loading={isGenerating}
              />
            </Stack>
          )}

          {generatedExecution && (
            <>
              <ExecutionMessage execution={generatedExecution} />
              <div
                id="scroll_ref"
                style={{ marginTop: "-64px" }}
              ></div>
            </>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}

export default NoScheduleGPTChat;
