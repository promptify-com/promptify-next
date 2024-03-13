import { useState } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TemplateSuggestionItem from "@/components/Chat/Messages/TemplateSuggestionItem";
import type { Templates } from "@/core/api/dto/templates";

interface Props {
  content: string;
  templates: Templates[];
  onScrollToBottom: () => void;
}

function TemplateSuggestions({ templates, onScrollToBottom, content }: Props) {
  const [visibleCount, setVisibleCount] = useState(3);

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
        {content}
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
              template={template}
              onScrollToBottom={onScrollToBottom}
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
