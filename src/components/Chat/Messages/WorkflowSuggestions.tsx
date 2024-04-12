import { useState } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import HtmlMessage from "@/components/Chat/Messages/HtmlMessage";
import WorkflowCard from "@/components/Automation/WorkflowCard";
import type { IMessage } from "@/components/Prompt/Types/chat";
import type { IWorkflow } from "@/components/Automation/types";

interface Props {
  message: IMessage;
  scrollToBottom: () => void;
}

function WorkflowSuggestions({ message, scrollToBottom }: Props) {
  const [visibleCount, setVisibleCount] = useState(3);
  const workflows = message.data || [];

  if (!workflows.length) {
    return null;
  }

  const pluralWorkflows = workflows.length > 1;

  return (
    <Stack>
      {!message.text ? (
        <Typography
          fontSize={16}
          lineHeight={"25.6px"}
          fontWeight={400}
          letterSpacing={"0.17px"}
          display={"flex"}
          alignItems={"center"}
          color={"onSurface"}
        >
          {`I found ${pluralWorkflows ? "these" : "this"} workflow${
            pluralWorkflows ? "s" : ""
          }, following your request:`}
        </Typography>
      ) : (
        <HtmlMessage message={message} />
      )}

      <Stack
        bgcolor={"surfaceContainerLow"}
        p={"8px"}
        borderRadius={"24px"}
        direction={"column"}
      >
        <Stack
          direction={"column"}
          gap={1}
        >
          {workflows?.slice(0, visibleCount).map(workflow => (
            <WorkflowCard
              key={workflow.id}
              workflow={workflow as IWorkflow}
              onScrollToBottom={scrollToBottom}
            />
          ))}

          {visibleCount < workflows.length && (
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Button
                variant="text"
                onClick={() => {
                  setVisibleCount(workflows.length);
                }}
                sx={{
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
              >
                and {workflows.length - visibleCount} prompts more...
              </Button>
            </Stack>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}

export default WorkflowSuggestions;
