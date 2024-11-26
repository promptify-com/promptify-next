import TemplateDetailsCard from "@/components/Prompt/Common/TemplateDetailsCard";
import { useAppSelector } from "@/hooks/useStore";
import Stack from "@mui/material/Stack";
import React, { Fragment } from "react";
import type { IWorkflow } from "../types";
import { IMessage } from "./types";
import { Typography } from "@mui/material";

interface Props {
  workflow: IWorkflow;
  messages: IMessage[];
  showRunButton: boolean;
  onGenerate: () => void;
}

function ChatInterface({ workflow, messages, onGenerate, showRunButton }: Props) {
  const { selectedApp } = useAppSelector(state => state.chat);
  return (
    <Stack
      gap={6}
      px={{ xs: "8px", md: "40px" }}
    >
      {selectedApp && (
        <TemplateDetailsCard
          title={workflow.name}
          categoryName={selectedApp.category?.name ?? ""}
          thumbnail={workflow.image ?? ""}
          tags={[]}
          description={workflow.description ?? ""}
        />
      )}
      <Stack>
        {messages.map(msg => (
          <Fragment key={msg.id}>
            <Typography>{msg.type}</Typography>
          </Fragment>
        ))}
      </Stack>
    </Stack>
  );
}

export default ChatInterface;
