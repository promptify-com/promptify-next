import { useState } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TemplateSuggestionItem from "@/components/Chat/Messages/TemplateSuggestionItem";
import type { Templates } from "@/core/api/dto/templates";

interface Props {
  templates: Templates[];
  scrollToBottom: () => void;
}

function TemplateSuggestions({ templates, scrollToBottom }: Props) {
  const [visibleCount, setVisibleCount] = useState(3);

  const pluralTemplates = templates.length > 1;

  return (
    <Stack>
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
          {templates.slice(0, visibleCount).map(template => (
            <TemplateSuggestionItem
              key={template.id}
              variant="chats"
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
