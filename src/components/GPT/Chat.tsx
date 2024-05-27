import React from "react";
import Stack from "@mui/material/Stack";
import type { IWorkflow } from "@/components/Automation/types";
import Box from "@mui/material/Box";
import { useEffect } from "react";
import useChat from "./Hooks/useChat";
import Message from "./Message";
import CredentialsContainer from "./CredentialsContainer";
import Choices from "./Choices";
import TimeSelect from "./TimeSelect";
import MessageContainer from "./MessageContainer";

const FREQUENCY_ITEMS = ["Daily", "Weekly", "Bi-Weekly", "Monthly"];

interface Props {
  workflow: IWorkflow;
}

export default function Chat({ workflow }: Props) {
  const { messages, initialMessages, startSchedule, cancelSchedule, setScheduleFrequency, setScheduleTime } = useChat({
    workflow,
  });

  const handleStartSchedule = (status: boolean) => {
    if (status) {
      startSchedule();
    } else {
      cancelSchedule();
    }
  };

  useEffect(() => {
    initialMessages();
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
          {message.type === "schedule_start" && (
            <MessageContainer message={message}>
              <Choices
                message={message.text}
                items={["Yes", "No"]}
                onSelect={item => handleStartSchedule(item === "Yes")}
              />
            </MessageContainer>
          )}
          {message.type === "schedule_frequency" && (
            <Choices
              message={message.text}
              items={FREQUENCY_ITEMS}
              onSelect={frequency => setScheduleFrequency(frequency.toLowerCase())}
            />
          )}
          {message.type === "schedule_time" && (
            <TimeSelect
              message={message.text}
              onSelect={setScheduleTime}
            />
          )}
        </Box>
      ))}
    </Stack>
  );
}
