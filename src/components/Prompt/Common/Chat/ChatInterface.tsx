import { useRef, Fragment, useState } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import South from "@mui/icons-material/South";
import Typography from "@mui/material/Typography";

import { Message } from "./Message";
import { useAppSelector } from "@/hooks/useStore";
import { getCurrentDateFormatted, timeAgo } from "@/common/helpers/timeManipulation";
import { isDesktopViewPort } from "@/common/helpers";
import AccordionMessage from "@/components/Prompt/VariantB/AccordionMessage";
import FeedbackThumbs from "@/components/Prompt/Common/FeedbackThumbs";
import useScrollToBottom from "@/components/Prompt/Hooks/useScrolltoBottom";
import TemplateDetailsCard from "@/components/Prompt/Common/TemplateDetailsCard";
import type { IMessage } from "@/components/Prompt/Types/chat";
import type { Templates } from "@/core/api/dto/templates";

type AccordionExpandedState = {
  spark: boolean;
  form: boolean;
  text: boolean;
};

interface Props {
  messages: IMessage[];
  template: Templates;
  onGenerate: () => void;
  onAbort: () => void;
  showGenerate: boolean;
}

export const ChatInterface = ({ template, messages, onGenerate, showGenerate, onAbort }: Props) => {
  const isGenerating = useAppSelector(state => state.template.isGenerating);
  const isDesktopView = isDesktopViewPort();

  const generatedExecution = useAppSelector(state => state.executions.generatedExecution);
  const selectedExecution = useAppSelector(state => state.executions.selectedExecution);
  const executionMode = Boolean(selectedExecution || generatedExecution);

  const [isHovered, setIsHovered] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const [expandedAccordions, setExpandedAccordions] = useState<AccordionExpandedState>({
    spark: true,
    form: true,
    text: false,
  });

  const { showScrollDown, scrollToBottom } = useScrollToBottom({ ref: messagesContainerRef, messages, isGenerating });

  const handleExpandChange = (type: keyof AccordionExpandedState, isExpanded: boolean) => {
    setExpandedAccordions(prev => ({
      ...prev,
      [type]: isExpanded,
    }));
  };

  const showAccorionMessage = (message: IMessage): boolean => {
    return Boolean(message.type === "form" || message.type === "spark");
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

        <Stack
          gap={3}
          direction={"column"}
        >
          {messages.map(msg => (
            <Fragment key={msg.id}>
              <Message
                message={msg}
                onScrollToBottom={scrollToBottom}
                isExecutionMode={executionMode}
              />
              {showAccorionMessage(msg) && (
                <Box
                  width={"100%"}
                  position={"relative"}
                  id={`accordion-${msg.type === "spark" ? "execution" : "input"}`}
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
                        type={msg.type === "spark" ? "spark" : "form"}
                        expanded={expandedAccordions[msg.type]}
                        onChange={(_e, isExpanded) => handleExpandChange(msg.type, isExpanded)}
                        template={template}
                        showGenerate={showGenerate}
                        abortGenerating={onAbort}
                        onGenerate={onGenerate}
                      />
                    </Box>

                    {msg.type === "spark" &&
                      !!selectedExecution?.prompt_executions?.length &&
                      expandedAccordions["spark"] && (
                        <Box
                          id="testt"
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
                          />
                        </Box>
                      )}
                  </Stack>
                </Box>
              )}
            </Fragment>
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
