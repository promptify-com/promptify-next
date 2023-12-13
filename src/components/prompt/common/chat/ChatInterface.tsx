import { useRef, Fragment, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import South from "@mui/icons-material/South";
import Typography from "@mui/material/Typography";

import { TemplateDetailsCard } from "../TemplateDetailsCard";
import { AccordionMessage } from "@/components/Prompt/VariantB/AccordionMessage";
import { Message } from "./Message";
import { useAppSelector } from "@/hooks/useStore";
import { getCurrentDateFormatted, timeAgo } from "@/common/helpers/timeManipulation";
import type { IPromptInput } from "@/common/types/prompt";
import type { IMessage } from "@/common/types/chat";
import type { Templates } from "@/core/api/dto/templates";
import type { PromptParams } from "@/core/api/dto/prompts";
import { isDesktopViewPort } from "@/common/helpers";

interface Props {
  messages: IMessage[];
  template: Templates;
  onChangeInput: (value: string | File, input: IPromptInput) => void;
  onChangeParam: (value: number, param: PromptParams) => void;
  onGenerate: () => void;
  onAbort: () => void;
  showGenerate: boolean;
}

export const ChatInterface = ({
  template,
  messages,
  onChangeInput,
  onChangeParam,
  onGenerate,
  showGenerate,
  onAbort,
}: Props) => {
  const isGenerating = useAppSelector(state => state.template.isGenerating);
  const isDesktopView = isDesktopViewPort();

  const generatedExecution = useAppSelector(state => state.executions.generatedExecution);
  const selectedExecution = useAppSelector(state => state.executions.selectedExecution);

  const [isHovered, setIsHovered] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const [isUserAtBottom, setIsUserAtBottom] = useState(true);
  const [showScrollDown, setShowScrollDown] = useState(false);

  const lastFormMessage = messages
    .slice()
    .reverse()
    .find(msg => msg.type === "form");

  const handleUserScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 80;
      setShowScrollDown(!isAtBottom);
      setIsUserAtBottom(isAtBottom);
    }
  };
  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
      setTimeout(handleUserScroll, 200);
    }
  };

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleUserScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleUserScroll);
      }
    };
  }, []);

  useEffect(() => {
    if (isUserAtBottom) {
      scrollToBottom();
    }
  }, [messages, isGenerating, generatedExecution]);

  const executionMode = Boolean(selectedExecution || generatedExecution);

  return (
    <Stack
      ref={messagesContainerRef}
      gap={3}
      mx={{ md: "40px" }}
      position={"relative"}
      sx={{
        overflow: "auto",
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
      }}
    >
      <TemplateDetailsCard
        template={template}
        min={!isDesktopView}
      />
      {showScrollDown && isGenerating && (
        <Box
          onClick={scrollToBottom}
          position={"fixed"}
          zIndex={999}
          bottom={"95px"}
          left={"50%"}
          sx={{
            transform: "translateX(-50%)",
            cursor: "pointer",
          }}
        >
          <Box
            sx={{
              height: "30px",
              width: "30px",
              borderRadius: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "surface.3",
              boxShadow: "0px 4px 8px 0px #E1E2EC, 0px 0px 4px 0px rgba(0, 0, 0, 0.30)",
              border: " none",
            }}
          >
            <South sx={{ fontSize: 16 }} />
          </Box>
        </Box>
      )}

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

        {executionMode && (
          <Box id="accordion-header">
            <AccordionMessage
              template={template}
              showGenerate={showGenerate}
              abortGenerating={onAbort}
              onChangeInput={onChangeInput}
              onChangeParam={onChangeParam}
              onGenerate={onGenerate}
              executionMode={true}
            />
          </Box>
        )}

        <Stack
          gap={3}
          display={!!generatedExecution ? "none" : "flex"}
          flexDirection={"column"}
        >
          {messages.map(msg => (
            <Fragment key={msg.id}>
              <Message
                message={msg}
                onScrollToBottom={scrollToBottom}
                isExecutionMode={executionMode}
              />
              {msg.type === "form" && msg.id === lastFormMessage?.id && (
                <Box
                  width={"100%"}
                  id="accordion-form"
                  position={"relative"}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  {isHovered && (
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
                  )}
                  <Box id="accordion-input">
                    <AccordionMessage
                      template={template}
                      showGenerate={showGenerate}
                      abortGenerating={onAbort}
                      onChangeInput={onChangeInput}
                      onChangeParam={onChangeParam}
                      onGenerate={onGenerate}
                      executionMode={false}
                    />
                  </Box>
                </Box>
              )}
            </Fragment>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};
