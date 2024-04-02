import { useState } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TemplateCard from "@/components/common/TemplateCard";
import HtmlMessage from "@/components/Chat/Messages/HtmlMessage";
import type { IMessage } from "@/components/Prompt/Types/chat";

interface Props {
  message: IMessage;
  scrollToBottom: () => void;
}

function TemplateSuggestions({ message, scrollToBottom }: Props) {
  const [visibleCount, setVisibleCount] = useState(3);
  const templates = message.templates || [];

  if (!templates.length) {
    return null;
  }

  return (
    <Stack>
      <HtmlMessage message={message} />
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
          {templates?.slice(0, visibleCount).map(template => (
            <TemplateCard
              key={template.id}
              template={template}
              onScrollToBottom={scrollToBottom}
            />
          ))}

          {visibleCount < templates.length && (
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Button
                variant="text"
                onClick={() => {
                  setVisibleCount(templates.length);
                }}
                sx={{
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
              >
                and {templates.length - visibleCount} prompts more...
              </Button>
            </Stack>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}

export default TemplateSuggestions;
