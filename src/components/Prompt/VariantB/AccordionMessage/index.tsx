import { useRef, useState } from "react";
import Stack from "@mui/material/Stack";
import Accordion from "@mui/material/Accordion";
import Typography from "@mui/material/Typography";
import AccordionDetails from "@mui/material/AccordionDetails";
import Fade from "@mui/material/Fade";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setIsSimulationStreaming } from "@/core/store/chatSlice";
import { Display } from "@/components/Prompt/Common/Display";
import Form from "@/components/Prompt/Common/Chat/Form";
import AccordionMessageHeader from "@/components/Prompt/VariantB/AccordionMessage/AccordionMessageHeader";
import useVariant from "@/components/Prompt/Hooks/useVariant";
import type { Templates } from "@/core/api/dto/templates";
import type { IMessage } from "@/components/Prompt/Types/chat";
import RunButton from "@/components/Prompt/Common/RunButton";
import Box from "@mui/material/Box";
import ClientOnly from "@/components/base/ClientOnly";
import { timeAgo } from "@/common/helpers/timeManipulation";
import FeedbackThumbs from "@/components/Prompt/Common/FeedbackThumbs";

interface Props {
  message: IMessage;
  template: Templates;
  onGenerate: () => void;
  showGenerate: boolean;
  abortGenerating?: () => void;
}

export default function AccordionMessage({ message, template, onGenerate, showGenerate, abortGenerating }: Props) {
  const dispatch = useAppDispatch();
  const { isAutomationPage } = useVariant();
  const isGenerating = useAppSelector(state => state.template.isGenerating);
  const currentUser = useAppSelector(state => state.user.currentUser);
  const inputs = useAppSelector(state => state.chat.inputs);
  const selectedExecution = useAppSelector(state => state.executions.selectedExecution);
  const hasInputs = !!inputs.length;
  const type = message.type;

  const [expanded, setExpanded] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const accordionRef = useRef<HTMLDivElement>(null);

  function getLabelText() {
    switch (true) {
      case isGenerating:
        return "Generation Result";
      case isAutomationPage && type === "form":
        return "WORKFLOW";
      case type === "credentials":
        return "CREDENTIALS";
      default:
        return "PROMPT Template";
    }
  }

  const canDisplayForm = type === "form" || type === "credentials";

  return (
    <Box
      id={`accordion-${type === "spark" ? "execution" : "input"}`}
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
            Promptify {timeAgo(message.createdAt)}
          </Typography>
        </ClientOnly>
      )}
      <Stack
        direction={"row"}
        position={"relative"}
      >
        {selectedExecution && (
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
                  type={type}
                  template={template}
                  isExpanded={expanded}
                  onCancel={abortGenerating}
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
                  <Stack>
                    <Typography
                      width={{ xs: "70%", sm: "auto" }}
                      borderRadius={"8px"}
                      bgcolor={"primary.main"}
                      p={"10px 8px 16px 16px"}
                      color={"white"}
                      lineHeight={"100%"}
                      letterSpacing={"1px"}
                      fontSize={"10px"}
                      textTransform={"uppercase"}
                      display={hasInputs ? "block" : "none"}
                    >
                      {`${getLabelText()} information.`}
                    </Typography>

                    <Stack
                      mt={"-10px"}
                      bgcolor={"surface.1"}
                      borderRadius={"8px"}
                      position={"relative"}
                    >
                      {type === "spark" && (
                        <Stack
                          padding={{ xs: "0px 8px", md: isGenerating ? "16px 0px 8px 64px" : "16px 0px 48px 64px" }}
                          position={"relative"}
                        >
                          <Display templateData={template} />
                        </Stack>
                      )}
                      {canDisplayForm && <Form messageType={type} />}
                    </Stack>
                  </Stack>
                  {showGenerate && type === "form" && currentUser?.id && (
                    <Stack
                      direction={"row"}
                      justifyContent={"end"}
                      mr={3}
                    >
                      <RunButton
                        title={`Run ${isAutomationPage ? "workflow" : "prompts"}`}
                        onClick={onGenerate}
                      />
                    </Stack>
                  )}
                </AccordionDetails>
              </Accordion>
            </Fade>
          </Box>
        )}

        {type === "spark" && !!selectedExecution?.prompt_executions?.length && expanded && (
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
