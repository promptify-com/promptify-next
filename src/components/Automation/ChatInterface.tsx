import { useRef, Fragment, useState } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useAppSelector } from "@/hooks/useStore";
import { getCurrentDateFormatted, timeAgo } from "@/common/helpers/timeManipulation";
import AccordionMessage from "@/components/Prompt/VariantB/AccordionMessage";
import FeedbackThumbs from "@/components/Prompt/Common/FeedbackThumbs";
import useScrollToBottom from "@/components/Prompt/Hooks/useScrollToBottom";
import TemplateDetailsCard from "@/components/Prompt/Common/TemplateDetailsCard";
import ClientOnly from "@/components/base/ClientOnly";
import type { IMessage } from "@/components/Prompt/Types/chat";
import type { Templates } from "@/core/api/dto/templates";
import { ExecutionMessage } from "@/components/Automation/ExecutionMessage";
import RunButton from "@/components/Prompt/Common/RunButton";
import { Message } from "../Prompt/Common/Chat/Message";
import ScrollDownButton from "@/components/common/buttons/ScrollDownButton";

type AccordionExpandedState = {
  spark: boolean;
  form: boolean;
  text: boolean;
  html: boolean;
  credentials: boolean;
};

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

  const [isHovered, setIsHovered] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const [expandedAccordions, setExpandedAccordions] = useState<AccordionExpandedState>({
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

  const handleExpandChange = (type: keyof AccordionExpandedState, isExpanded: boolean) => {
    setExpandedAccordions(prev => ({
      ...prev,
      [type]: isExpanded,
    }));
  };

  const allowRun = currentUser?.id && !isGenerating && !isValidating;
  const hasInputs = inputs.length > 0;

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
                <Box
                  width={"100%"}
                  position={"relative"}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  {isHovered && (
                    <ClientOnly>
                      <Typography
                        sx={{
                          position: "absolute",
                          top: -20,
                          opacity: 0.5,
                          left: 2,
                          zIndex: 999,
                        }}
                        fontSize={12}
                        variant="caption"
                      >
                        Promptify {timeAgo(msg.createdAt)}
                      </Typography>
                    </ClientOnly>
                  )}
                  <Stack
                    direction={"row"}
                    position={"relative"}
                  >
                    <Box
                      display={"flex"}
                      sx={{
                        flex: "0 0 100%",
                      }}
                    >
                      <AccordionMessage
                        type={msg.type}
                        expanded={expandedAccordions[msg.type]}
                        onChange={(_e, isExpanded) => handleExpandChange(msg.type, isExpanded)}
                        template={template!}
                        showGenerate={showGenerate}
                        onGenerate={onGenerate}
                      />
                    </Box>

                    {msg.type === "spark" &&
                      !!selectedExecution?.prompt_executions?.length &&
                      expandedAccordions["spark"] && (
                        <Box
                          sx={{
                            position: "sticky",
                            top: "10px",
                            right: "40px",
                            mt: "20%",
                            height: "fit-content",
                            mb: "30px",
                            display: { xs: "none", md: "block" },
                          }}
                        >
                          <FeedbackThumbs
                            execution={selectedExecution}
                            vertical
                            variant="icon"
                          />
                        </Box>
                      )}
                  </Stack>
                </Box>
              )}
            </Fragment>
          ))}
          {!hasInputs && allowRun && (
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
