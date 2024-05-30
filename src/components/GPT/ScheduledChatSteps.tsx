import React from "react";
import Stack from "@mui/material/Stack";
import type { FrequencyType, IWorkflow } from "@/components/Automation/types";
import Box from "@mui/material/Box";
import { useEffect } from "react";
import useChat from "./Hooks/useChat";
import Message from "./Message";
import CredentialsContainer from "./CredentialsContainer";
import Choices from "./Choices";
import ResponseProvidersContainer from "./ResponseProvidersContainer";
import useCredentials from "@/components/Automation/Hooks/useCredentials";
import ActivateWorkflowMessage from "./ActivateWorkflowMessage";
import { FREQUENCY_ITEMS } from "./Constants";
import FrequencyTimeSelector from "./FrequencyTimeSelector";

interface Props {
  workflow: IWorkflow;
}

export default function ScheduledChatSteps({ workflow }: Props) {
  const { initializeCredentials } = useCredentials();
  const { messages, initialMessages, setScheduleFrequency, setScheduleTime, prepareWorkflow, activateWorkflow } =
    useChat({
      workflow,
    });

  useEffect(() => {
    initialMessages();
    initializeCredentials();
  }, [workflow]);

  return (
    <Stack
      flex={1}
      gap={8}
      sx={{
        p: "48px",
      }}
    >
      {messages.map(message => (
        <Box
          key={message.id}
          sx={{
            ...(!message.fromUser && {
              mr: "56px",
            }),
            ...(message.fromUser && {
              ml: "56px",
            }),
            ...(message.noHeader && {
              mt: "-34px",
            }),
          }}
        >
          {message.type === "text" && <Message message={message} />}
          {message.type === "credentials" && (
            <CredentialsContainer
              message={message.text}
              workflow={workflow}
            />
          )}
          {message.type === "schedule_frequency" && (
            <Choices
              message={message.text}
              items={FREQUENCY_ITEMS}
              onSelect={frequency => setScheduleFrequency(frequency as FrequencyType)}
            />
          )}
          {message.type === "schedule_time" && (
            <FrequencyTimeSelector
              message={message.text}
              onSelect={setScheduleTime}
            />
          )}
          {message.type === "schedule_providers" && (
            <ResponseProvidersContainer
              message={message.text}
              workflow={workflow}
              prepareWorkflow={provider => prepareWorkflow(provider)}
            />
          )}
          {message.type === "schedule_activation" && (
            <ActivateWorkflowMessage
              message={message}
              onActivate={activateWorkflow}
            />
          )}
        </Box>
      ))}
    </Stack>
  );
}
