import TemplateDetailsCard from "@/components/Prompt/Common/TemplateDetailsCard";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import Stack from "@mui/material/Stack";
import React, { Fragment, useRef } from "react";
import type { IWorkflow, IWorkflowCreateResponse } from "../types";
import WorkflowPlaceholder from "../WorkflowPlaceholder";
import SuggestionChoices from "@/components/Automation/ChatInterface/SuggestionChoices";
import Message from "./messages/MessageText";
import CredentialsContainer from "./messages/Credentials";
import MessageForm from "./messages/MessageForm";
import ApiAccess from "./messages/ApiAccess";
import { useSaveDocumentMutation } from "@/core/api/workflows";
import { formatDateWithOrdinal } from "./helper";
import { setToast } from "@/core/store/toastSlice";
import type { IApp, IGPTDocumentPayload } from "../app/hooks/types";
import type { IMessage } from "./types";

interface Props {
  workflow: IWorkflow;
  messages: IMessage[];
  showRunButton: boolean;
  onGenerate: () => void;
  validateQuery: boolean;
  handleSubmit: (query: string) => Promise<void>;
  retryWorkflow: (executionWorkflow: IApp) => Promise<void>;
}

function ChatInterface({
  workflow,
  messages,
  onGenerate,
  showRunButton,
  handleSubmit,
  validateQuery,
  retryWorkflow,
}: Props) {
  const dispatch = useAppDispatch();
  const [saveDocument] = useSaveDocumentMutation();
  const { selectedApp } = useAppSelector(state => state.chat);

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const saveGPTDocument = async (executionWorkflow: IApp, content: string) => {
    if (!executionWorkflow) {
      return false;
    }

    const payload: IGPTDocumentPayload = {
      output: content,
      title: executionWorkflow.name + ", " + formatDateWithOrdinal(new Date().toISOString()),
      workflow_id: executionWorkflow.id,
    };

    try {
      await saveDocument({ payload }).unwrap();
      dispatch(
        setToast({
          message: "Document saved",
          severity: "info",
          duration: 6000,
        }),
      );

      return true;
    } catch (error) {
      dispatch(
        setToast({
          message: "Something went wrong, please try again! ",
          severity: "error",
          duration: 6000,
          position: { vertical: "bottom", horizontal: "right" },
        }),
      );
      console.error(error);
    }

    return false;
  };

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
            {/* 
            <MessageForm />
            <ApiAccess />
            <CredentialsContainer
              workflow={workflow}
              scrollToBottom={() => {}}
            /> */}
            {msg.type === "API_instructions" && <ApiAccess />}
            {msg.type === "form" && <MessageForm />}

            {msg.type === "workflowExecution" && (
              <Message
                message={msg}
                retryExecution={() => retryWorkflow(msg.data as IApp)}
                saveAsDocument={() => saveGPTDocument(msg.data as IApp, msg.text ?? "")}
                scrollToBottom={() => {}}
              />
            )}

            {msg.type === "credentials" && (
              <CredentialsContainer
                workflow={workflow}
                scrollToBottom={() => {}}
              />
            )}
            {index === messages.length - 1 && !validateQuery && !msg.fromUser && msg.type !== "readyMessage" && (
              <SuggestionChoices
                is_schedulable={workflow.is_schedulable ?? false}
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
