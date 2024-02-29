import { useRef } from "react";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";

import { useAppSelector } from "@/hooks/useStore";
import { getCurrentDateFormatted } from "@/common/helpers/timeManipulation";
import useScrollToBottom from "@/components/Prompt/Hooks/useScrollToBottom";
import TemplateDetailsCard from "@/components/Prompt/Common/TemplateDetailsCard";

import type { IMessage } from "@/components/Prompt/Types/chat";
import type { Templates } from "@/core/api/dto/templates";
import { Message } from "./Message";

const currentDate = getCurrentDateFormatted();

interface Props {
  messages: IMessage[];
  onGenerate: () => void;
  showGenerate: boolean;
  isValidating: boolean;
  onAbort?: () => void;
}

export const ChatInterface = ({ messages, onGenerate, showGenerate, onAbort, isValidating }: Props) => {
  const inputs = useAppSelector(state => state.chat.inputs);

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const { scrollToBottom } = useScrollToBottom({
    ref: messagesContainerRef,
    content: messages,
    isGenerating: false,
  });

  return (
    <Stack
      ref={messagesContainerRef}
      gap={3}
      position={"relative"}
      sx={messagesContainerStyle}
    >
      <Stack
        pb={{ md: "38px" }}
        direction={"column"}
        gap={3}
      >
        <Stack
          gap={3}
          direction={"column"}
        >
          {messages.map(msg => (
            <Message
              key={msg.id}
              message={msg}
              onScrollToBottom={scrollToBottom}
              isExecutionShown={false}
            />
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};

const messagesContainerStyle = {
  overflowY: "auto",
  overflowX: "hidden",
  px: "8px",
  overscrollBehavior: "contain",
  scrollBehavior: "smooth",
  "&::-webkit-scrollbar": {
    width: { xs: "4px", md: "6px" },
    p: 1,
    backgroundColor: "surface.1",
  },
  "&::-webkit-scrollbar-track": {
    webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "surface.5",
    outline: "1px solid surface.1",
    borderRadius: "10px",
  },
};
