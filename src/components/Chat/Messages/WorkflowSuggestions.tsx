import { useState } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Fade from "@mui/material/Fade";
import HtmlMessage from "@/components/Chat/Messages/HtmlMessage";
import WorkflowCard from "@/components/Automation/WorkflowCard";
import type { IMessage } from "@/components/Prompt/Types/chat";
import type { ITemplateWorkflow } from "@/components/Automation/types";
import { checkIfWithinLastMinute } from "@/common/helpers/timeManipulation";

interface Props {
  message: IMessage;
  scrollToBottom: () => void;
  lastMessage: IMessage;
  autoScrollToBottom: () => void;
}

function WorkflowSuggestions({ message, scrollToBottom, lastMessage, autoScrollToBottom }: Props) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);
  const workflows = (message.data as ITemplateWorkflow[]) || [];

  if (!workflows.length) {
    return null;
  }

  const pluralWorkflows = workflows.length > 1;
  const isLastMessage = lastMessage.id === message.id;

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
        <HtmlMessage
          message={message}
          shouldStream={isLastMessage && checkIfWithinLastMinute(message.createdAt)}
          onStreamingFinished={() => {
            setShowSuggestions(true);
            scrollToBottom();
          }}
          autoScrollToBottom={autoScrollToBottom}
        />
      )}

      <Fade
        in={showSuggestions}
        unmountOnExit
        timeout={800}
      >
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
                workflow={workflow as ITemplateWorkflow}
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
      </Fade>
    </Stack>
  );
}

export default WorkflowSuggestions;
