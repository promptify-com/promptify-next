import { useState } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import TemplateSuggestionItem from "@/components/Chat/Messages/TemplateSuggestionItem";
import type { Templates } from "@/core/api/dto/templates";
import { useAppDispatch } from "@/hooks/useStore";
import { setSelectedChat, setSelectedTemplate, setAnswers } from "@/core/store/chatSlice";
import { useCreateChatMutation } from "@/core/api/chats";

interface Props {
  content: string;
  templates: Templates[];
  scrollToBottom: () => void;
}

function TemplateSuggestions({ templates, scrollToBottom, content }: Props) {
  const dispatch = useAppDispatch();
  const [createChat] = useCreateChatMutation();
  const [visibleCount, setVisibleCount] = useState(3);

  const handleRunPrompt = async (template: Templates, newChat?: boolean) => {
    if (newChat) {
      await handleCreateChat(template);
    }

    dispatch(setSelectedTemplate(template));
    dispatch(setAnswers([]));
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  };

  const handleCreateChat = async (template: Templates) => {
    try {
      const newChat = await createChat({
        title: template.title ?? "Welcome",
        thumbnail: template.thumbnail,
      }).unwrap();
      dispatch(setSelectedChat(newChat));
    } catch (err) {
      console.error("Error creating a new chat: ", err);
    }
  };

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
              onRun={newChat => handleRunPrompt(template, newChat)}
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
