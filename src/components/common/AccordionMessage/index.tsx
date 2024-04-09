import { type ReactNode, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Accordion from "@mui/material/Accordion";
import Typography from "@mui/material/Typography";
import AccordionDetails from "@mui/material/AccordionDetails";
import Fade from "@mui/material/Fade";

import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setIsSimulationStreaming } from "@/core/store/chatSlice";
import AccordionMessageHeader from "@/components/common/AccordionMessage/Header";

import FeedbackThumbs from "@/components/Prompt/Common/FeedbackThumbs";
import type { Templates } from "@/core/api/dto/templates";
import type { IMessage, MessageType } from "@/components/Prompt/Types/chat";

interface Props {
  messageType: MessageType;
  children: ReactNode;
  template?: Templates;
  abortGenerating?: () => void;
  messages?: IMessage[];
}

export default function AccordionMessage({ messageType, children, template, messages = [], abortGenerating }: Props) {
  const dispatch = useAppDispatch();
  const selectedExecution = useAppSelector(state => state.executions.selectedExecution);

  const [expanded, setExpanded] = useState(true);
  const accordionRef = useRef<HTMLDivElement>(null);

  return (
    <Box
      id={`accordion-${messageType === "spark" ? "execution" : "input"}`}
      width={"100%"}
      position={"relative"}
    >
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
          <Fade
            in={true}
            unmountOnExit
            timeout={800}
            onTransitionEnd={() => dispatch(setIsSimulationStreaming(false))}
          >
            <Accordion
              ref={accordionRef}
              elevation={0}
              expanded={expanded}
              onChange={(_, state) => setExpanded(state)}
              sx={{ p: 0, flex: 1 }}
            >
              <AccordionMessageHeader
                type={messageType}
                template={template!}
                isExpanded={expanded}
                onCancel={abortGenerating}
                messages={messages}
              />

              <AccordionDetails
                sx={{
                  mt: -4,
                  p: { xs: "32px 8px 10px 8px", md: "32px 16px 12px 16px" },
                  bgcolor: "surface.2",
                  overflow: "hidden",
                  borderRadius: "0px 16px 16px 16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {children}
              </AccordionDetails>
            </Accordion>
          </Fade>
        </Box>

        {messageType === "spark" && !!selectedExecution?.prompt_executions?.length && expanded && (
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
  );
}
