import { useRef, Fragment } from "react";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";

import { useAppSelector } from "@/hooks/useStore";
import { getCurrentDateFormatted } from "@/common/helpers/timeManipulation";
import AccordionMessage from "@/components/common/AccordionMessage";
import useScrollToBottom from "@/components/Prompt/Hooks/useScrollToBottom";
import TemplateDetailsCard from "@/components/Prompt/Common/TemplateDetailsCard";
import { ExecutionMessage } from "@/components/Automation/ExecutionMessage";
import { Message } from "@/components/Prompt/Common/Chat/Message";
import RunButton from "@/components/Prompt/Common/RunButton";
import ScrollDownButton from "@/components/common/buttons/ScrollDownButton";
import AccordionContentAutomation from "@/components/common/AccordionMessage/AccordionDetails/AccordionContentAutomation";
import Form from "@/components/Prompt/Common/Chat/Form";
import type { IMessage } from "@/components/Prompt/Types/chat";
import type { Templates } from "@/core/api/dto/templates";

const currentDate = getCurrentDateFormatted();

interface Props {
  template: Templates;
  messages: IMessage[];
  onGenerate: () => void;
  showGenerate: boolean;
  isValidating: boolean;
}

export const ChatInterface = ({ template, messages, onGenerate, showGenerate, isValidating }: Props) => {
  const isGenerating = useAppSelector(state => state.template.isGenerating);
  const { generatedExecution } = useAppSelector(state => state.executions);
  const currentUser = useAppSelector(state => state.user.currentUser);
  const { inputs, areCredentialsStored } = useAppSelector(state => state.chat);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const { showScrollDown, scrollToBottom } = useScrollToBottom({
    ref: messagesContainerRef,
    content: messages,
  });

  const hasInputs = inputs.length > 0;
  const allowNoInputsRun =
    !hasInputs && areCredentialsStored && showGenerate && currentUser?.id && !isGenerating && !isValidating;

  function showAccordionMessage(message: IMessage): boolean {
    const type = message.type;
    return Boolean(type === "credentials" || (type === "form" && hasInputs));
  }

  return (
    <Stack
      ref={messagesContainerRef}
      gap={3}
      mx={{ md: "40px" }}
      position={"relative"}
      sx={messagesContainerStyle}
    >
      {template && (
        <TemplateDetailsCard
          title={template.title}
          categoryName={template?.category.name}
          thumbnail={template.thumbnail}
          tags={template.tags}
          description={template.description}
        />
      )}

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
          {generatedExecution ? (
            <ExecutionMessage execution={generatedExecution} />
          ) : (
            messages.map(msg => (
              <Fragment key={msg.id}>
                <Message
                  message={msg}
                  onScrollToBottom={scrollToBottom}
                />
                {showAccordionMessage(msg) && (
                  <AccordionMessage
                    messageType={msg.type}
                    template={template}
                  >
                    <AccordionContentAutomation
                      title={msg.type === "credentials" ? "CREDENTIALS information." : "WORKFLOW information."}
                      onGenerate={onGenerate}
                      showRunButton={Boolean(showGenerate && msg.type === "form" && currentUser?.id)}
                    >
                      <Stack
                        mt={"-10px"}
                        bgcolor={"surface.1"}
                        borderRadius={"8px"}
                        position={"relative"}
                      >
                        {(msg.type === "form" || msg.type === "credentials") && <Form messageType={msg.type} />}
                      </Stack>
                    </AccordionContentAutomation>
                  </AccordionMessage>
                )}
              </Fragment>
            ))
          )}

          {allowNoInputsRun && (
            <RunButton
              title="Run workflow"
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
