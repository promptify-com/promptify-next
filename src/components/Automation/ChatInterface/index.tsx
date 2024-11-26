import TemplateDetailsCard from "@/components/Prompt/Common/TemplateDetailsCard";
import { useAppSelector } from "@/hooks/useStore";
import Stack from "@mui/material/Stack";
import React, { Fragment } from "react";
import type { IWorkflow } from "../types";
import { IMessage } from "./types";
import { Typography } from "@mui/material";
import WorkflowPlaceholder from "../WorkflowPlaceholder";
import SuggestionChoices from "@/components/Automation/ChatInterface/SuggestionChoices";
import useChat from "@/components/Automation/app/hooks/useChatApp";

interface Props {
  workflow: IWorkflow;
  messages: IMessage[];
  showRunButton: boolean;
  onGenerate: () => void;
}

function ChatInterface({ workflow, messages, onGenerate, showRunButton }: Props) {
  const { selectedApp } = useAppSelector(state => state.chat);
  const { handleSubmit, validatingQuery } = useChat();
  return (
    <Stack
      gap={6}
      px={{ xs: "8px", md: "40px" }}
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
      <Stack>
        {messages.map((msg, index) => (
          <Fragment key={msg.id}>
            <Typography>{msg.type}</Typography>
            {index === messages.length - 1 && !validatingQuery && !msg.fromUser && msg.type !== "readyMessage" && (
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

export default ChatInterface;
