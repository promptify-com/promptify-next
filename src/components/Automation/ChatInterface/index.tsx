import TemplateDetailsCard from "@/components/Prompt/Common/TemplateDetailsCard";
import { useAppSelector } from "@/hooks/useStore";
import Stack from "@mui/material/Stack";
import React from "react";
import type { IWorkflow } from "../types";

interface Props {
  workflow: IWorkflow;
}

function ChatInterface({ workflow }: Props) {
  const { selectedApp } = useAppSelector(state => state.chat);
  return (
    <Stack>
      {selectedApp && (
        <TemplateDetailsCard
          title={workflow.name}
          categoryName={selectedApp.category?.name ?? ""}
          thumbnail={workflow.image ?? ""}
          tags={[]}
          description={workflow.description ?? ""}
        />
      )}
    </Stack>
  );
}

export default ChatInterface;
