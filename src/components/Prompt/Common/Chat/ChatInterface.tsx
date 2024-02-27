import { useRef, Fragment } from "react";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";

import { useAppSelector } from "@/hooks/useStore";
import { getCurrentDateFormatted } from "@/common/helpers/timeManipulation";
import AccordionMessage from "@/components/common/AccordionMessage/index";
import useScrollToBottom from "@/components/Prompt/Hooks/useScrollToBottom";
import TemplateDetailsCard from "@/components/Prompt/Common/TemplateDetailsCard";
import RunButton from "@/components/Prompt/Common/RunButton";
import ScrollDownButton from "@/components/common/buttons/ScrollDownButton";
import AccordionContentPrompt from "@/components/common/AccordionMessage/AccordionDetails/AccordionContentPrompt";
import { Display } from "@/components/Prompt/Common/Display";
import Form from "@/components/Prompt/Common/Chat/Form";
import { Message } from "@/components/Prompt/Common/Chat/Message";
import type { IMessage } from "@/components/Prompt/Types/chat";
import type { Templates } from "@/core/api/dto/templates";

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
                  messageType={msg.type}
                  messageTimestamp={msg.createdAt}
                  template={template}
                  abortGenerating={onAbort}
                  messages={messages}
                >
                  <AccordionContentPrompt
                    title={isGenerating ? "Generation Result information." : "PROMPT Template information."}
                    onGenerate={onGenerate}
                    showRunButton={Boolean(showGenerate && msg.type === "form" && currentUser?.id)}
                  >
                    <Stack
                      mt={"-10px"}
                      bgcolor={"surface.1"}
                      borderRadius={"8px"}
                      position={"relative"}
                    >
                      {msg.type === "spark" && (
                        <Stack
                          padding={{ xs: "0px 8px", md: isGenerating ? "16px 0px 8px 64px" : "16px 0px 48px 64px" }}
                          position={"relative"}
                        >
                          <Display templateData={template} />
                        </Stack>
                      )}
                      {msg.type === "form" && <Form messageType={"form"} />}
                    </Stack>
                  </AccordionContentPrompt>
                </AccordionMessage>
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
