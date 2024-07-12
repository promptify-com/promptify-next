import { useEffect, useRef } from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { initialState as initialChatState, setAnswers } from "@/core/store/chatSlice";
import useChat from "@/components/GPT/Hooks/useChat";
import Message from "@/components/GPT/Message";
import CredentialsContainer from "@/components/GPT/CredentialsContainer";
import Choices from "@/components/GPT/Choices";
import ResponseProvidersContainer from "@/components/GPT/ResponseProvidersContainer";
import useCredentials from "@/components/Automation/Hooks/useCredentials";
import RunWorkflowMessage from "@/components/GPT/RunWorkflowMessage";
import { FREQUENCY_ITEMS } from "@/components/GPT/Constants";
import FrequencyTimeSelector from "@/components/GPT/FrequencyTimeSelector";
import MessageInputs from "@/components/GPT/MessageInputs";
import ChatCredentialsPlaceholder from "@/components/GPT/ChatCredentialsPlaceholder";
import type { FrequencyType, ITemplateWorkflow, IWorkflowCreateResponse } from "@/components/Automation/types";
import { ExecutionMessage } from "@/components/Automation/ExecutionMessage";
import { createMessage } from "@/components/Chat/helper";
import { useScrollToElement } from "@/hooks/useScrollToElement";
import { isAdminFn } from "@/core/store/userSlice";
import useBrowser from "@/hooks/useBrowser";
import { theme } from "@/theme";
import { getWorkflowInputsValues } from "../GPTs/helpers";
import useScrollToBottom from "../Prompt/Hooks/useScrollToBottom";

interface Props {
  workflow: ITemplateWorkflow;
  allowActivateButton?: boolean;
}

export default function ScheduledChatSteps({ workflow, allowActivateButton }: Props) {
  const dispatch = useAppDispatch();
  const { initializeCredentials } = useCredentials();
  const workflowLoaded = useRef(false);
  const { isMobile } = useBrowser();

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
  } = useChat({
    workflow,
  });

  const isAdmin = useAppSelector(isAdminFn);
  const { clonedWorkflow, inputs } = useAppSelector(store => store.chat ?? initialChatState);
  const generatedExecution = useAppSelector(state => state.executions?.generatedExecution ?? null);
  const workflowScheduled = !!clonedWorkflow?.periodic_task?.crontab;
  const alreadyScheduled = useRef(workflowScheduled);

  const containerRef = useRef<HTMLDivElement>(null);

  const { showScrollDown, scrollToBottom } = useScrollToBottom({
    ref: containerRef,
    content: messages,
  });

  const scrollToTarget = (target: string, delay = 0) => {
    setTimeout(() => {
      const element = document.querySelector(target);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }, delay);
  };

  useEffect(() => {
    if (messages.length > 0 || generatedExecution) {
      scrollToBottom();
    }
  }, [messages, generatedExecution]);

  useEffect(() => {
    if (!alreadyScheduled.current && workflowScheduled) {
      setTimeout(() => scrollToBottom(), 100);
    }
    alreadyScheduled.current = workflowScheduled;
  }, [workflowScheduled]);

  useEffect(() => {
    if (clonedWorkflow && !workflowLoaded.current) {
      initialMessages();
      initializeCredentials();
      workflowLoaded.current = true;

      const answers = getWorkflowInputsValues(clonedWorkflow);
      dispatch(setAnswers(answers));
    }
  }, [clonedWorkflow, dispatch]);

  const cloneExecutionInputs = (data: IWorkflowCreateResponse) => {
    if (data) {
      dispatch(setAnswers(getWorkflowInputsValues(data)));
    }
    scrollToInputsForm();
  };

  const scrollToInputsForm = () => {
    scrollToTarget("#inputs_form", 300);
  };

  const FREQUENCIES = isAdmin ? FREQUENCY_ITEMS : FREQUENCY_ITEMS.slice(1);

  const showInputsForm = !!inputs.length && !generatedExecution;

  return (
    <Stack
      flex={1}
      gap={8}
      position={"relative"}
      ref={containerRef}
      sx={{
        p: { xs: "16px", md: "48px" },
        height: "calc(100svh - 90px)",
        overflowY: "scroll",
      }}
    >
      {!!messages.length ? (
        <>
          {messages.map(message => {
            return (
              <Box
                key={message.id}
                sx={{
                  ...(message.noHeader && {
                    mt: "-34px",
                  }),
                }}
              >
                {message.type === "text" && <Message message={message} />}
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
                    onSelect={frequency => setScheduleFrequency(frequency as FrequencyType)}
                    defaultValue={clonedWorkflow?.periodic_task?.crontab.frequency ?? ""}
                  />
                )}
                {message.type === "schedule_time" && (
                  <FrequencyTimeSelector
                    message={message.text}
                    onSelect={setScheduleTime}
                  />
                )}
                {message.type === "schedule_providers" && (
                  <Stack gap={8}>
                    <ResponseProvidersContainer
                      message={message.text}
                      workflow={workflow}
                      injectProvider={injectProvider}
                      removeProvider={removeProvider}
                    />
                  </Stack>
                )}
              </Box>
            );
          })}
          {generatedExecution && (
            <>
              <ExecutionMessage execution={generatedExecution} />
            </>
          )}
          {workflowScheduled && (
            <>
              {showInputsForm && (
                <Box id="inputs_form">
                  <MessageInputs
                    message={createMessage({
                      type: "form",
                      text: "Please fill out the following details:",
                    })}
                  />
                </Box>
              )}
              <RunWorkflowMessage
                onRun={runWorkflow}
                allowActivateButton={allowActivateButton}
              />
            </>
          )}
        </>
      ) : (
        <ChatCredentialsPlaceholder />
      )}
    </Stack>
  );
}
