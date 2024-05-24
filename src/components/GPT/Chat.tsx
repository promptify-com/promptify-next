import React from "react";
import Stack from "@mui/material/Stack";
import type { IWorkflow } from "@/components/Automation/types";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import ChatInput from "@/components/Chat/ChatInput";
import useChat from "./Hooks/useChat";
import { Message } from "@/components/Prompt/Common/Chat/Message";
import CredentialsContainer from "./CredentialsContainer";

interface Props {
  workflow: IWorkflow;
}

export default function Chat({ workflow }: Props) {
  const { messages, initialMessages } = useChat({ workflow });
  const [isValidating, setIsValidating] = useState(false);

  const handleSubmitMessage = (message: string) => {};

  useEffect(() => {
    initialMessages();
  }, [workflow]);

  const disableChatInput = false;

  return (
    <Stack
      gap={6}
      sx={{
        p: "48px",
      }}
    >
      <Box>
        {messages.map(message => (
          <React.Fragment key={message.id}>
            {message.type === "text" && <Message message={message} />}
            {message.type === "credentials" && <CredentialsContainer workflow={workflow} />}
          </React.Fragment>
        ))}
      </Box>
      <ChatInput
        onSubmit={(value: string) => {
          handleSubmitMessage(value);
        }}
        disabled={disableChatInput}
        isValidating={isValidating}
      />
    </Stack>
  );
}
