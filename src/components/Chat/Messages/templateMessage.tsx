import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import MessageBoxHeader from "./MessageBoxHeader";
import type { Templates } from "@/core/api/dto/templates";

interface Props {
  content: string;
  template: Templates;
  onScrollToBottom(): void;
}

function TemplateMessage({ content, onScrollToBottom, template }: Props) {
  return (
    <Stack
      direction={"column"}
      gap={2}
    >
      <MessageBoxHeader
        variant="FORM"
        template={template}
        onScrollToBottom={onScrollToBottom}
      />
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
    </Stack>
  );
}

export default TemplateMessage;
