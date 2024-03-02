import Stack from "@mui/material/Stack";

import TemplateSuggestionItem from "@/components/Chat/TemplateSuggestionItem";
import type { Templates } from "@/core/api/dto/templates";
import { useAppDispatch } from "@/hooks/useStore";
import { setSelectedTemplate } from "@/core/store/chatSlice";

interface Props {
  templates: Templates[];
  scrollToBottom: () => void;
}

function TemplateSuggestions({ templates, scrollToBottom }: Props) {
  const dispatch = useAppDispatch();
  return (
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
              setTimeout(() => {
                scrollToBottom();
              }, 100);
            }}
          />
        ))}
      </Stack>
    </Stack>
  );
}

export default TemplateSuggestions;
