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
import { kwargsToAnswers } from "@/components/GPTs/helpers";
import useBrowser from "@/hooks/useBrowser";
import { theme } from "@/theme";

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
  } = useChat({
    workflow,
  });

  const isAdmin = useAppSelector(isAdminFn);
  const { clonedWorkflow, inputs } = useAppSelector(store => store.chat ?? initialChatState);
  const generatedExecution = useAppSelector(state => state.executions?.generatedExecution ?? null);
  const isGenerating = useAppSelector(state => state.templates?.isGenerating ?? false);
  const workflowScheduled = !!clonedWorkflow?.periodic_task?.crontab;
  const alreadyScheduled = useRef(workflowScheduled);

  const scrollTo = useScrollToElement("smooth");
  const headerHeight = parseFloat(isMobile ? theme.custom.headerHeight.xs : theme.custom.headerHeight.md);

  const scrollToBottom = () => {
    scrollTo("#scroll_ref", headerHeight);
  };

  useEffect(() => {
    setTimeout(() => scrollToBottom(), 100);
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

      const kwargs = clonedWorkflow.periodic_task?.kwargs;
      if (kwargs) {
        dispatch(setAnswers(kwargsToAnswers(kwargs)));
      }
    }
  }, [clonedWorkflow, dispatch]);

  const cloneExecutionInputs = (data: IWorkflowCreateResponse) => {
    if (data) {
      const kwargs = data.periodic_task?.kwargs;
      dispatch(setAnswers(kwargsToAnswers(kwargs ?? "")));
    }
    scrollToInputsForm();
  };

  const scrollToInputsForm = () => {
    setTimeout(() => scrollTo("#inputs_form", headerHeight), 300);
  };

  const FREQUENCIES = isAdmin ? FREQUENCY_ITEMS : FREQUENCY_ITEMS.slice(1);

  const lastMessage = messages[messages.length - 1];
  const isLastExecution = lastMessage?.type === "workflowExecution";
  const showInputsForm = !!inputs.length && !generatedExecution;

  return (
    <Stack
      flex={1}
      gap={8}
      sx={{
        p: { xs: "16px", md: "48px" },
      }}
      position={"relative"}
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
                {!generatedExecution && isLastExecution && message.id === lastMessage?.id && <div id="scroll_ref" />}

                {message.type === "text" && <Message message={message} />}
                {message.type === "workflowExecution" && (
                  <Message
                    message={message}
                    retryExecution={() => retryRunWorkflow(message.data as IWorkflowCreateResponse)}
                    showInputs={() => cloneExecutionInputs(message.data as IWorkflowCreateResponse)}
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
              <div
                id="scroll_ref"
                style={{ marginTop: "-64px" }}
              ></div>
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
          {!generatedExecution && !isLastExecution && (
            <div
              id="scroll_ref"
              style={{ marginTop: "-64px" }}
            />
          )}
        </>
      ) : (
        <ChatCredentialsPlaceholder />
      )}
    </Stack>
  );
}
