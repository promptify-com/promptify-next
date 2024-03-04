import Stack from "@mui/material/Stack";

import TemplateSuggestionItem from "@/components/Chat/TemplateSuggestionItem";
import type { Templates } from "@/core/api/dto/templates";
import { useAppDispatch } from "@/hooks/useStore";
import { setSelectedChatOption, setSelectedTemplate } from "@/core/store/chatSlice";
import Typography from "@mui/material/Typography";

interface Props {
  content: string;
  templates: Templates[];
  scrollToBottom: () => void;
}

function TemplateSuggestions({ templates, scrollToBottom, content }: Props) {
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
      >
        <Stack
          direction={"column"}
          gap={"8px"}
        >
          {templates.map(template => (
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
        </Stack>
      </Stack>
    </Stack>
  );
}

export default TemplateSuggestions;
