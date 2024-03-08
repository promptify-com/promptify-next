import { useState } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import TemplateSuggestionItem from "@/components/Chat/Messages/TemplateSuggestionItem";
import type { Templates } from "@/core/api/dto/templates";
import { useAppDispatch } from "@/hooks/useStore";
import { setSelectedChatOption, setSelectedTemplate } from "@/core/store/chatSlice";

interface Props {
  content: string;
  templates: Templates[];
  scrollToBottom: () => void;
}

function TemplateSuggestions({ templates, scrollToBottom, content }: Props) {
  const [visibleCount, setVisibleCount] = useState(3);

  const showMore = visibleCount < templates.length;

  const dispatch = useAppDispatch();
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
              onClick={() => {
                dispatch(setSelectedTemplate(template));
                dispatch(setSelectedChatOption(undefined));
                setTimeout(() => {
                  scrollToBottom();
                }, 100);
              }}
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
                  setTimeout(() => {
                    scrollToBottom();
                  }, 100);
                  setVisibleCount(templates.length);
                }}
                sx={{
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
              >
                and {visibleCount} prompts more...
              </Button>
            </Stack>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}

export default TemplateSuggestions;
