import { useState } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TemplateCard from "@/components/common/TemplateCard";
import Typography from "@mui/material/Typography";
import HtmlMessage from "@/components/Chat/Messages/HtmlMessage";
import type { IMessage } from "@/components/Prompt/Types/chat";
import type { Templates } from "@/core/api/dto/templates";

interface Props {
  message: IMessage;
  scrollToBottom: () => void;
}

function TemplateSuggestions({ message, scrollToBottom }: Props) {
  const [visibleCount, setVisibleCount] = useState(3);
  const templates = message.data || [];

  if (!templates.length) {
    return null;
  }

  const pluralTemplates = templates.length > 1;

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
          {`I found ${pluralTemplates ? "these" : "this"} prompt${pluralTemplates ? "s" : ""}, following your request:`}
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
          {templates?.slice(0, visibleCount).map(template => (
            <TemplateCard
              key={template.id}
              template={template as Templates}
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
