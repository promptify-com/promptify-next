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
import type { FrequencyType, ITemplateWorkflow } from "@/components/Automation/types";
import type { IAnswer } from "@/components/Prompt/Types/chat";
import type { PromptInputType } from "@/components/Prompt/Types";
import { ExecutionMessage } from "@/components/Automation/ExecutionMessage";
import { isNodeProvider } from "@/components/GPTs/helpers";
import { createMessage } from "@/components/Chat/helper";

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
    runWorkflow,
    removeProvider,
  } = useChat({
    workflow,
  });

  const { clonedWorkflow, inputs } = useAppSelector(store => store.chat ?? initialState);
  const generatedExecution = useAppSelector(state => state.executions?.generatedExecution ?? null);

  const hasProvider = !!clonedWorkflow && clonedWorkflow.nodes.some(node => isNodeProvider(clonedWorkflow, node.id));
  const workflowScheduled = !!clonedWorkflow?.periodic_task?.crontab;

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

  return (
    <Stack
      flex={1}
      gap={8}
      sx={{
        p: { xs: "16px", md: "48px" },
      }}
    >
      {!!messages.length ? (
        <>
          {messages.map(message => (
            <Box
              key={message.id}
              sx={{
                ...(!message.fromUser && {
                  mr: { xs: "0px", md: "48px" },
                }),
                ...(message.fromUser && {
                  ml: { md: "48px" },
                }),
                ...(message.noHeader && {
                  mt: "-34px",
                }),
              }}
            >
              {message.type === "text" && <Message message={message} />}
              {message.type === "html" && <Message message={message} />}

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
                  items={FREQUENCY_ITEMS}
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

                  {workflowScheduled && !!inputs.length && (
                    <MessageInputs
                      message={createMessage({
                        type: "form",
                        text: "Please fill out the following details:",
                      })}
                    />
                  )}

                  {workflowScheduled && hasProvider && (
                    <RunWorkflowMessage
                      onRun={runWorkflow}
                      allowActivateButton={allowActivateButton}
                    />
                  )}
                </Stack>
              )}
            </Box>
          ))}

          {generatedExecution && <ExecutionMessage execution={generatedExecution} />}
        </>
      ) : (
        <ChatCredentialsPlaceholder />
      )}
    </Stack>
  );
}
