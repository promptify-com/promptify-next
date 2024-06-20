import { useEffect, useRef } from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { initialState, setAnswers } from "@/core/store/chatSlice";
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
import type { IAnswer } from "@/components/Prompt/Types/chat";
import type { PromptInputType } from "@/components/Prompt/Types";
import { ExecutionMessage } from "@/components/Automation/ExecutionMessage";
import { createMessage } from "@/components/Chat/helper";
import { useScrollToElement } from "@/hooks/useScrollToElement";
import { isAdminFn } from "@/core/store/userSlice";

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
  } = useChat({
    workflow,
  });

  const isAdmin = useAppSelector(isAdminFn);
  const { clonedWorkflow, inputs } = useAppSelector(store => store.chat ?? initialState);
  const generatedExecution = useAppSelector(state => state.executions?.generatedExecution ?? null);

  const scrollTo = useScrollToElement("smooth");

  const scrollToBottom = () => {
    scrollTo("#scroll_ref");
  };

  useEffect(() => {
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  }, [messages, generatedExecution]);

  useEffect(() => {
    if (clonedWorkflow && !workflowLoaded.current) {
      initialMessages();
      initializeCredentials();
      workflowLoaded.current = true;

      const kwargs = clonedWorkflow.periodic_task?.kwargs;
      if (kwargs) {
        const parsedKwargs = JSON.parse(kwargs || "{}");
        const workflowData = parsedKwargs.workflow_data || {};

        const answers: IAnswer[] = Object.entries(workflowData).map(([inputName, answer]) => ({
          inputName,
          required: true,
          question: ``,
          answer: answer as PromptInputType,
          prompt: 0,
        }));

        dispatch(setAnswers(answers));
      }
    }
  }, [clonedWorkflow, dispatch]);

  const workflowScheduled = !!clonedWorkflow?.periodic_task?.crontab;
  const FREQUENCIES = isAdmin ? FREQUENCY_ITEMS : FREQUENCY_ITEMS.filter(freq => freq !== "hourly");

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
          {messages.map((message, idx) => (
            <Box
              key={message.id}
              sx={{
                ...(message.noHeader && {
                  mt: "-34px",
                }),
              }}
            >
              {!generatedExecution && idx === messages.length - 1 && <div id="scroll_ref"></div>}

              {message.type === "text" && <Message message={message} />}
              {message.type === "workflowExecution" && (
                <Message
                  message={message}
                  retryExecution={() => retryRunWorkflow(message.data as IWorkflowCreateResponse)}
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
          ))}

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
              {!!inputs.length && (
                <MessageInputs
                  message={createMessage({
                    type: "form",
                    text: "Please fill out the following details:",
                  })}
                />
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
