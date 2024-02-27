import { useRef, Fragment } from "react";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import { Message } from "./Message";
import { useAppSelector } from "@/hooks/useStore";
import { getCurrentDateFormatted } from "@/common/helpers/timeManipulation";
import AccordionMessage from "@/components/Prompt/VariantB/AccordionMessage/index";
import useScrollToBottom from "@/components/Prompt/Hooks/useScrollToBottom";
import TemplateDetailsCard from "@/components/Prompt/Common/TemplateDetailsCard";
import type { IMessage } from "@/components/Prompt/Types/chat";
import type { Templates } from "@/core/api/dto/templates";
import RunButton from "@/components/Prompt/Common/RunButton";
import ScrollDownButton from "@/components/common/buttons/ScrollDownButton";

const currentDate = getCurrentDateFormatted();

interface Props {
  template: Templates;
  messages: IMessage[];
  onGenerate: () => void;
  showGenerate: boolean;
  isValidating: boolean;
  onAbort?: () => void;
}

export const ChatInterface = ({ template, messages, onGenerate, showGenerate, onAbort, isValidating }: Props) => {
  const isGenerating = useAppSelector(state => state.template.isGenerating);
  const { generatedExecution, selectedExecution } = useAppSelector(state => state.executions);
  const currentUser = useAppSelector(state => state.user.currentUser);
  const isExecutionShown = Boolean(selectedExecution || generatedExecution);
  const inputs = useAppSelector(state => state.chat.inputs);

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const { showScrollDown, scrollToBottom } = useScrollToBottom({
    ref: messagesContainerRef,
    content: messages,
    isGenerating,
  });

  const hasContent = template.prompts.some(prompt => prompt.content);
  const hasInputs = inputs.length > 0;
  const allowNoInputsRun = !hasInputs && currentUser?.id && hasContent && !isGenerating && !isValidating;

  const showAccordionMessage = (message: IMessage): boolean => {
    const type = message.type;
    return "spark" === type || (type === "form" && hasInputs);
  };

  return (
    <Stack
      ref={messagesContainerRef}
      gap={3}
      mx={{ md: "40px" }}
      position={"relative"}
      sx={messagesContainerStyle}
    >
      <TemplateDetailsCard
        title={template.title}
        categoryName={template?.category.name}
        thumbnail={template.thumbnail}
        tags={template.tags}
        description={template.description}
      />

      {showScrollDown && isGenerating && <ScrollDownButton onClick={scrollToBottom} />}

      <Stack
        pb={{ md: "38px" }}
        direction={"column"}
        gap={3}
      >
        <Divider
          sx={{
            fontSize: 12,
            fontWeight: 400,
            color: "onSurface",
            opacity: 0.5,
          }}
        >
          {currentDate}
        </Divider>

        <Stack
          gap={3}
          direction={"column"}
        >
          {messages.map(msg => (
            <Fragment key={msg.id}>
              <Message
                message={msg}
                onScrollToBottom={scrollToBottom}
                isExecutionShown={isExecutionShown}
              />
              {showAccordionMessage(msg) && (
                <AccordionMessage
                  message={msg}
                  template={template}
                  onGenerate={onGenerate}
                  showGenerate={showGenerate}
                  abortGenerating={onAbort}
                  messages={msg.type === "spark" ? messages : []}
                />
              )}
            </Fragment>
          ))}
          {allowNoInputsRun && (
            <RunButton
              title="Run prompts"
              onClick={onGenerate}
            />
          )}
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
