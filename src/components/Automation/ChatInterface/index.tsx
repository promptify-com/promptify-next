import TemplateDetailsCard from "@/components/Prompt/Common/TemplateDetailsCard";
import { useAppSelector } from "@/hooks/useStore";
import Stack from "@mui/material/Stack";
import React, { Fragment, useRef } from "react";
import type { IWorkflow } from "../types";
import { IMessage } from "./types";
import WorkflowPlaceholder from "../WorkflowPlaceholder";
import SuggestionChoices from "@/components/Automation/ChatInterface/SuggestionChoices";
import Message from "./messages/MessageText";
import CredentialsContainer from "./messages/Credentials";
import MessageForm from "./messages/MessageForm";
import ApiAccess from "./messages/ApiAccess";

interface Props {
  workflow: IWorkflow;
  messages: IMessage[];
  showRunButton: boolean;
  onGenerate: () => void;
  validateQuery: boolean;
  handleSubmit: (query: string) => Promise<void>;
}

function ChatInterface({ workflow, messages, onGenerate, showRunButton, handleSubmit, validateQuery }: Props) {
  const { selectedApp } = useAppSelector(state => state.chat);

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  return (
    <Stack
      px={{ xs: "8px", md: "40px" }}
      ref={messagesContainerRef}
      gap={3}
      mx={{ md: "40px" }}
      position={"relative"}
      sx={messagesContainerStyle}
    >
      {workflow ? (
        <TemplateDetailsCard
          title={workflow.name}
          categoryName={selectedApp?.category?.name ?? ""}
          thumbnail={workflow.image ?? ""}
          tags={[]}
          description={workflow.description ?? ""}
        />
      ) : (
        <WorkflowPlaceholder />
      )}
      <Stack gap={5}>
        {messages.map((msg, index) => (
          <Fragment key={msg.id}>
            {msg.type === "text" && (
              <Message
                message={msg}
                scrollToBottom={() => {}}
              />
            )}

            <MessageForm />
            <ApiAccess />
            {msg.type === "API_instructions" && <ApiAccess />}
            {msg.type === "form" && <MessageForm />}

            {/* {msg.type === "workflowExecution" && (
              <Message
                message={msg}
                retryExecution={() => retryRunWorkflow(message.data as IWorkflowCreateResponse)}
                showInputs={() => cloneExecutionInputs(message.data as IWorkflowCreateResponse)}
                saveAsDocument={() => saveGPTDocument(message.data as IWorkflowCreateResponse, message.text)}
                scrollToBottom={scrollToBottom}
              />
            )} */}

            {msg.type === "credentials" && (
              <CredentialsContainer
                message={msg.text ?? ""}
                workflow={workflow}
                isScheduled
                scrollToBottom={() => {}}
              />
            )}
            {index === messages.length - 1 && !validateQuery && !msg.fromUser && msg.type !== "readyMessage" && (
              <SuggestionChoices
                workflow={workflow}
                onSubmit={handleSubmit}
                messageType={msg.type}
              />
            )}
          </Fragment>
        ))}
      </Stack>
    </Stack>
  );
}

const messagesContainerStyle = {
  overflowY: "auto",
  overflowX: "hidden",
  px: "8px",
  overscrollBehavior: "contain",
  scrollBehavior: "smooth",
  "&::-webkit-scrollbar": {
    width: { xs: "4px", md: "6px" },
    p: 1,
    backgroundColor: "surface.1",
  },
  "&::-webkit-scrollbar-track": {
    webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "surface.5",
    outline: "1px solid surface.1",
    borderRadius: "10px",
  },
};

export default ChatInterface;
