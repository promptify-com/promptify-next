import { Fragment, useRef } from "react";
import TemplateDetailsCard from "@/components/Prompt/Common/TemplateDetailsCard";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import Stack from "@mui/material/Stack";

import WorkflowPlaceholder from "../WorkflowPlaceholder";
import { setToast } from "@/core/store/toastSlice";
import SuggestionChoices from "@/components/Automation/ChatInterface/SuggestionChoices";
import Message from "./messages/MessageText";
import CredentialsContainer from "./messages/Credentials";
import MessageForm from "./messages/MessageForm";
import ApiAccess from "./messages/ApiAccess";
import { useSaveDocumentMutation } from "@/core/api/workflows";
import { formatDateWithOrdinal } from "@/components/Automation/ChatInterface/helper";
import RunButtonMessage from "@/components/Automation/ChatInterface/messages/RunMessage/";
import { ExecutionMessage } from "@/components/Automation/ExecutionMessage";
import useScrollToBottom from "@/components/Automation/app/hooks/useScrollToBottom";
import type { IWorkflow } from "@/components/Automation/types";
import type { IApp, IGPTDocumentPayload } from "@/components/Automation/app/hooks/types";
import type { IMessage } from "@/components/Automation/ChatInterface/types";

interface Props {
  workflow: IWorkflow;
  messages: IMessage[];
  onGenerate: () => void;
  validateQuery: boolean;
  handleSubmit: (query: string) => Promise<void>;
  retryWorkflow: (executionWorkflow: IApp) => Promise<void>;
}

function ChatInterface({ workflow, messages, onGenerate, handleSubmit, validateQuery, retryWorkflow }: Props) {
  const dispatch = useAppDispatch();
  const [saveDocument] = useSaveDocumentMutation();
  const { selectedApp, runInstantly } = useAppSelector(state => state.chat);
  const generatedExecution = useAppSelector(state => state.executions.generatedExecution);

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const { scrollToBottom } = useScrollToBottom({
    ref: messagesContainerRef,
    content: messages,
    skipScroll: false,
  });

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
                scrollToBottom={scrollToBottom}
              />
            )}

            {msg.type === "API_instructions" && <ApiAccess />}
            {msg.type === "form" && <MessageForm />}

            {msg.type === "workflowExecution" && (
              <Message
                message={msg}
                retryExecution={() => retryWorkflow(msg.data as IApp)}
                saveAsDocument={() => saveGPTDocument(msg.data as IApp, msg.text ?? "")}
                scrollToBottom={scrollToBottom}
              />
            )}

            {msg.type === "credentials" && (
              <CredentialsContainer
                workflow={workflow}
                scrollToBottom={scrollToBottom}
              />
            )}
            {index === messages.length - 1 && !validateQuery && !msg.fromUser && msg.type !== "readyMessage" && (
              <SuggestionChoices
                is_schedulable={workflow.is_schedulable ?? false}
                onSubmit={handleSubmit}
                messageType={msg.type}
              />
            )}

            {msg.type === "readyMessage" && (
              <Stack gap={8}>
                <Stack id="run-message">
                  <RunButtonMessage
                    estimatedExecutionTime={workflow.estimated_execution_time}
                    runInstantly={runInstantly}
                    onRun={() => {
                      onGenerate();
                      scrollToBottom();
                    }}
                  />
                </Stack>
              </Stack>
            )}
          </Fragment>
        ))}

        {generatedExecution && (
          <>
            <ExecutionMessage execution={generatedExecution} />
          </>
        )}
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
