import { Fragment, useCallback, useEffect, useRef } from "react";
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
import { isAdminFn } from "@/core/store/userSlice";
import { getWorkflowInputsValues } from "../GPTs/helpers";

interface Props {
  workflow: ITemplateWorkflow;
  allowActivateButton?: boolean;
}

export default function ScheduledChatSteps({ workflow, allowActivateButton }: Props) {
  const dispatch = useAppDispatch();
  const { initializeCredentials } = useCredentials();
  const workflowLoaded = useRef(false);

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
  const { clonedWorkflow, inputs, areCredentialsStored } = useAppSelector(store => store.chat ?? initialChatState);
  const generatedExecution = useAppSelector(state => state.executions?.generatedExecution ?? null);
  const isGenerating = useAppSelector(state => state.templates?.isGenerating ?? null);

  const workflowScheduled = !!clonedWorkflow?.periodic_task?.crontab;
  const alreadyScheduled = useRef(workflowScheduled);
  const bottomRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, []);

  const checkScrollAndAdjust = useCallback(() => {
    if (spacerRef.current) {
      const rect = spacerRef.current.getBoundingClientRect();
      if (rect.top < window.innerHeight + 60) {
        scrollToBottom();
      }
    }
  }, [scrollToBottom]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          checkScrollAndAdjust();
        }
      },
      { threshold: 0.1 },
    );

    if (spacerRef.current) {
      observer.observe(spacerRef.current);
    }

    return () => observer.disconnect();
  }, [checkScrollAndAdjust]);

  useEffect(() => {
    if (messages.length > 0 || generatedExecution) {
      checkScrollAndAdjust();
    }
  }, [messages, generatedExecution, isGenerating]);

  useEffect(() => {
    if (!generatedExecution) {
      return;
    }
    scrollToTarget("#run-message", 300);
  }, [isGenerating, generatedExecution]);

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

  const scrollToTarget = (target: string, delay = 0) => {
    setTimeout(() => {
      const element = document.querySelector(target);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }, delay);
  };

  const scrollToInputsForm = () => {
    scrollToTarget("#inputs_form", 300);
  };

  const FREQUENCIES = isAdmin ? FREQUENCY_ITEMS : FREQUENCY_ITEMS.slice(1);

  const showInputsForm = !!inputs.length && !generatedExecution;

  const isNone = clonedWorkflow?.schedule?.frequency === "none";

  const hasScheduleProvidersMessage = Boolean(messages.find(msg => msg.type === "schedule_providers"));
  const hasReadyMessage = Boolean(messages.find(msg => msg.type === "readyMessage"));
  const canShowRunButton = !isGenerating && allowActivateButton && areCredentialsStored;

  const showRunButton =
    (canShowRunButton && hasScheduleProvidersMessage) ||
    (!isGenerating && isNone && hasReadyMessage && areCredentialsStored);

  return (
    <Stack
      flex={1}
      gap={8}
      position={"relative"}
      sx={{
        p: { xs: "16px", md: "48px" },
      }}
    >
      {!!messages.length ? (
        <>
          {messages.map(message => {
            return (
              <Fragment key={message.id}>
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
                    defaultValue={clonedWorkflow?.periodic_task?.frequency ?? ""}
                  />
                )}

                {message.type === "schedule_time" && !isNone && (
                  <FrequencyTimeSelector
                    message={message.text}
                    onSelect={setScheduleTime}
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
              </Fragment>
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
              {showRunButton && (
                <Stack id="run-message">
                  <RunWorkflowMessage
                    onRun={() => {
                      runWorkflow();
                      scrollToBottom();
                    }}
                  />
                </Stack>
              )}
            </>
          )}
        </>
      ) : (
        <ChatCredentialsPlaceholder />
      )}
      <div
        ref={spacerRef}
        style={{ height: "60px" }}
      />

      <div ref={bottomRef} />
    </Stack>
  );
}
