import { Fragment, useEffect, useRef } from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import { Message } from "./Message";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import GenerateAndClearButton from "./GenerateAndClearButton";
import { isDesktopViewPort } from "@/common/helpers";
import { MessageSparkBox } from "./MessageSparkBox";
import TemplateDetailsCard from "@/components/Prompt/Common/TemplateDetailsCard";
import FeedbackThumbs from "../../Common/FeedbackThumbs";
import Form from "@/components/Prompt/Common/Chat/Form";
import { GeneratingProgressCard } from "@/components/common/cards/GeneratingProgressCard";
import { setGeneratedExecution } from "@/core/store/executionsSlice";
import { setGeneratingStatus } from "@/core/store/templatesSlice";
import type { IMessage } from "@/components/Prompt/Types/chat";
import type { Templates } from "@/core/api/dto/templates";

interface Props {
  template: Templates;
  messages: IMessage[];
  onGenerate: () => void;
  showGenerate: boolean;
  isValidating: boolean;
  abortGenerating: () => void;
}

export const ChatInterface = ({
  template,
  messages,
  onGenerate,
  showGenerate,
  isValidating,
  abortGenerating,
}: Props) => {
  const dispatch = useAppDispatch();
  const isDesktopView = isDesktopViewPort();

  const isGenerating = useAppSelector(state => state.template.isGenerating);
  const { selectedExecution, generatedExecution } = useAppSelector(state => state.executions);

  const isExecutionShown = Boolean(selectedExecution ?? generatedExecution);

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isExecutionShown, showGenerate]);

  const abortConnection = () => {
    abortGenerating();
    dispatch(setGeneratedExecution(null));
    dispatch(setGeneratingStatus(false));
  };

  return (
    <Stack
      ref={messagesContainerRef}
      gap={3}
      sx={{
        overflowX: "hidden",
        overflowY: "auto",
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
      }}
    >
      <div style={{ marginTop: "auto" }}></div>

      <Box mx={!isDesktopView ? "16px" : "40px"}>
        {typeof template !== "undefined" && !isExecutionShown && (
          <TemplateDetailsCard
            title={template.title}
            categoryName={template?.category.name}
            thumbnail={template.thumbnail}
            tags={template.tags}
            description={template.description}
          />
        )}
      </Box>

      <Stack mx={{ xs: "16px", md: !isExecutionShown ? "40px" : "32px" }}>
        <Divider
          sx={{
            fontSize: 12,
            fontWeight: 400,
            color: "onSurface",
            opacity: 0.5,
          }}
        >
          New messages
        </Divider>
        {messages.map(msg => (
          <Fragment key={msg.id}>
            <Message
              isExecutionShown={isExecutionShown}
              message={msg}
              onScrollToBottom={scrollToBottom}
            />
            {msg.type === "form" && (
              <Box
                ml={{ xs: 0, md: !isExecutionShown ? "48px" : 0 }}
                mb={2}
                mt={{ xs: 0, md: msg.noHeader ? -2.5 : 0 }}
              >
                <Form
                  onScrollToBottom={scrollToBottom}
                  messageType={msg.type}
                />
              </Box>
            )}
            {msg.type === "spark" && msg.spark && (
              <Stack
                mx={{ xs: 0, md: !isExecutionShown ? "48px" : 0 }}
                mb={2}
                gap={2}
              >
                <Box maxWidth={"360px"}>
                  <MessageSparkBox
                    execution={msg.spark}
                    min
                  />
                </Box>

                <Box>
                  <Typography
                    fontSize={12}
                    fontWeight={500}
                    color={"onSurface"}
                    mb={"10px"}
                  >
                    Quick Feedback:
                  </Typography>

                  <FeedbackThumbs
                    execution={msg.spark}
                    variant="button"
                  />
                </Box>
              </Stack>
            )}
          </Fragment>
        ))}
      </Stack>

      <GenerateAndClearButton
        onGenerate={onGenerate}
        showGenerate={showGenerate}
        isValidating={isValidating}
      />

      {isGenerating && (
        <Box width={"100%"}>
          <GeneratingProgressCard onCancel={abortConnection} />
        </Box>
      )}
    </Stack>
  );
};
