import { useRef, Fragment, useState } from "react";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import { useAppSelector } from "@/hooks/useStore";
import { getCurrentDateFormatted } from "@/common/helpers/timeManipulation";
import AccordionMessage from "@/components/Prompt/VariantB/AccordionMessage/index";
import useScrollToBottom from "@/components/Prompt/Hooks/useScrollToBottom";
import TemplateDetailsCard from "@/components/Prompt/Common/TemplateDetailsCard";
import type { ExpandedAccordionState, IMessage } from "@/components/Prompt/Types/chat";
import type { Templates } from "@/core/api/dto/templates";
import { ExecutionMessage } from "@/components/Automation/ExecutionMessage";
import RunButton from "@/components/Prompt/Common/RunButton";
import { Message } from "@/components/Prompt/Common/Chat/Message";
import ScrollDownButton from "@/components/common/buttons/ScrollDownButton";

interface Props {
  template: Templates;
  messages: IMessage[];
  onGenerate: () => void;
  showGenerate: boolean;
  isValidating: boolean;
}

export const ChatInterface = ({ template, messages, onGenerate, showGenerate, isValidating }: Props) => {
  const isGenerating = useAppSelector(state => state.template.isGenerating);
  const { generatedExecution, selectedExecution } = useAppSelector(state => state.executions);
  const currentUser = useAppSelector(state => state.user.currentUser);
  const isExecutionShown = Boolean(selectedExecution || generatedExecution);
  const inputs = useAppSelector(state => state.chat.inputs);

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const [expandedAccordions, setExpandedAccordions] = useState<ExpandedAccordionState>({
    spark: true,
    form: true,
    credentials: true,
    text: false,
    html: false,
  });

  const { showScrollDown, scrollToBottom } = useScrollToBottom({
    ref: messagesContainerRef,
    content: messages,
    isGenerating,
  });

  const handleExpandChange = (type: keyof ExpandedAccordionState, isExpanded: boolean) => {
    setExpandedAccordions(prev => ({
      ...prev,
      [type]: isExpanded,
    }));
  };

  const hasInputs = inputs.length > 0;
  const allowNoInputsRun = !hasInputs && currentUser?.id && !isGenerating && !isValidating;

  const showAccordionMessage = (message: IMessage): boolean => {
    const type = message.type;
    return Boolean(type === "credentials" || (type === "form" && hasInputs));
  };

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
          {getCurrentDateFormatted()}
        </Divider>

        <Stack
          gap={3}
          direction={"column"}
        >
          {generatedExecution && <ExecutionMessage execution={generatedExecution} />}
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
                  expanded={expandedAccordions[msg.type]}
                  onChange={(_, isExpanded) => handleExpandChange(msg.type, isExpanded)}
                  template={template!}
                  showGenerate={showGenerate}
                  onGenerate={onGenerate}
                />
              )}
            </Fragment>
          ))}
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
