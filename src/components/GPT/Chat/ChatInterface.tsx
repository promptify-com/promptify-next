import { Fragment, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Stack from "@mui/material/Stack";

import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { initialState as initialChatState, setAnswers } from "@/core/store/chatSlice";
import useChat from "@/components/GPT/Hooks/useChatAIApp";
import { isAdminFn } from "@/core/store/userSlice";
import { getWorkflowInputsValues } from "@/components/GPTs/helpers";
import { FREQUENCY_ITEMS } from "@/components/GPT/Constants";
import CredentialsContainer from "@/components/GPT/CredentialsContainer";
import Choices from "@/components/GPT/Choices";
import FrequencyTimeSelector from "@/components/GPT/FrequencyTimeSelector";
import ResponseProvidersContainer from "@/components/GPT/ResponseProvidersContainer";
import Message from "@/components/GPT/Message";
import useCredentials from "@/components/Automation/Hooks/useCredentials";
import ChatInput from "@/components/Chat/ChatInput";
import SigninButton from "@/components/common/buttons/SigninButton";
import RunWorkflowMessage from "@/components/GPT/RunWorkflowMessage";
import SuggestionChoices from "@/components/GPT/Chat/SuggestionChoices";
import useScrollToBottom from "@/components/Prompt/Hooks/useScrollToBottom";
import MessageInputs from "@/components/GPT/MessageInputs";
import type { FrequencyType, ITemplateWorkflow, IWorkflowCreateResponse } from "@/components/Automation/types";

interface Props {
  workflow: ITemplateWorkflow;
}

const ChatInterface = ({ workflow }: Props) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { clonedWorkflow } = useAppSelector(state => state.chat ?? initialChatState);
  const isAdmin = useAppSelector(isAdminFn);
  const currentUser = useAppSelector(state => state.user.currentUser);

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const workflowLoaded = useRef(false);
  const [selectedFrequency, setSelectedFrequency] = useState<FrequencyType | undefined>(
    clonedWorkflow?.periodic_task?.frequency,
  );

  const { initializeCredentials } = useCredentials();
  const {
    messages,
    initialMessages,
    setScheduleFrequency,
    setScheduleTime,
    injectProvider,
    removeProvider,
    runWorkflow,
    retryRunWorkflow,
    saveGPTDocument,
    handleSubmit,
    validatingQuery,
  } = useChat({
    workflow,
  });

  const { extractCredentialsInputFromNodes } = useCredentials();

  const { scrollToBottom } = useScrollToBottom({
    ref: messagesContainerRef,
    content: messages,
    skipScroll: false,
  });

  const getCredentials = async () => {
    if (!clonedWorkflow) {
      return;
    }
    const { nodes } = clonedWorkflow;

    const credentialsInput = await extractCredentialsInputFromNodes(nodes);
    console.log(nodes, credentialsInput);
  };

  useEffect(() => {
    if (clonedWorkflow && !workflowLoaded.current) {
      initialMessages();
      initializeCredentials();
      getCredentials();

      workflowLoaded.current = true;

      const answers = getWorkflowInputsValues(clonedWorkflow);
      dispatch(setAnswers(answers));
    }
  }, [clonedWorkflow, dispatch]);

  const cloneExecutionInputs = (data: IWorkflowCreateResponse) => {
    if (data) {
      dispatch(setAnswers(getWorkflowInputsValues(data)));
    }
    // scrollToInputsForm();
  };

  const FREQUENCIES = isAdmin ? FREQUENCY_ITEMS : FREQUENCY_ITEMS.slice(1);
  const isNone = clonedWorkflow?.schedule?.frequency === "none";

  return (
    <Stack
      sx={{
        px: { xs: "16px", md: "48px" },
        height: {
          xs: `calc(100svh - 200px))`,
          md: `calc(100svh - 280px)`,
        },
      }}
    >
      <Stack
        sx={{
          height: {
            xs: "calc(100% - 90.5px)",
            md: "100%",
          },
          px: { xs: "8px", md: 0 },
        }}
      >
        <Stack
          ref={messagesContainerRef}
          gap={3}
          position={"relative"}
          sx={{
            overflowY: "auto",
            overflowX: "hidden",
            py: "40px",
            overscrollBehavior: "contain",
            scrollBehavior: "smooth",
            "&::-webkit-scrollbar": {
              width: "0px",
            },
            justifyContent: "space-between",
            height: {
              xs: "calc(100% - 90.5px)",
              md: "100%",
            },
          }}
        >
          <Stack
            direction={"column"}
            gap={8}
            justifyContent={"space-between"}
          >
            {messages.map(message => (
              <Fragment key={message.id}>
                {message.type === "text" && (
                  <Message
                    message={message}
                    scrollToBottom={scrollToBottom}
                  />
                )}
                {message.type === "workflowExecution" && (
                  <Message
                    message={message}
                    retryExecution={() => retryRunWorkflow(message.data as IWorkflowCreateResponse)}
                    showInputs={() => cloneExecutionInputs(message.data as IWorkflowCreateResponse)}
                    saveAsDocument={() => saveGPTDocument(message.data as IWorkflowCreateResponse, message.text)}
                  />
                )}

                {message.type === "credentials" && (
                  <CredentialsContainer
                    message={message.text}
                    workflow={workflow}
                    isScheduled
                  />
                )}
                {message.type === "schedule_frequency" && (
                  <Choices
                    message={message.text}
                    items={FREQUENCIES}
                    onSelect={frequency => {
                      setScheduleFrequency(frequency as FrequencyType);
                      setSelectedFrequency(frequency as FrequencyType);
                    }}
                    selectedValue={selectedFrequency || clonedWorkflow?.periodic_task?.crontab.frequency}
                  />
                )}

                {message.type === "schedule_time" && !isNone && (
                  <FrequencyTimeSelector
                    message={message.text}
                    onSelect={setScheduleTime}
                    selectedFrequency={selectedFrequency || clonedWorkflow?.periodic_task?.crontab.frequency}
                  />
                )}
                {message.type === "schedule_providers" && !isNone && (
                  <Stack gap={8}>
                    <ResponseProvidersContainer
                      message={message.text}
                      workflow={workflow}
                      injectProvider={injectProvider}
                      removeProvider={removeProvider}
                    />
                  </Stack>
                )}
                {message.type === "form" && <MessageInputs allowGenerate={false} />}
                {message.type === "readyMessage" && !isNone && (
                  <Stack gap={8}>
                    <Stack id="run-message">
                      <RunWorkflowMessage
                        estimatedExecutionTime={workflow.estimated_execution_time}
                        runInstantly
                        onRun={() => {
                          runWorkflow();
                          // scrollToBottom();
                        }}
                      />
                    </Stack>
                  </Stack>
                )}
              </Fragment>
            ))}
          </Stack>
        </Stack>
        <Stack>
          {currentUser?.id ? (
            <>
              {!validatingQuery && (
                <SuggestionChoices
                  workflow={workflow}
                  onSubmit={handleSubmit}
                />
              )}
              <ChatInput
                onSubmit={handleSubmit}
                disabled={false}
                isValidating={validatingQuery}
              />
            </>
          ) : (
            <Stack
              direction={"column"}
              alignItems={"center"}
              justifyContent={"center"}
              gap={1}
              width={{ md: "100%" }}
              p={{ md: "16px 8px 16px 16px" }}
            >
              <SigninButton onClick={() => router.push("/signin")} />
            </Stack>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ChatInterface;
