import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

import Stack from "@mui/material/Stack";
import Accordion from "@mui/material/Accordion";
import Typography from "@mui/material/Typography";
import AccordionDetails from "@mui/material/AccordionDetails";

import { useAppSelector } from "@/hooks/useStore";
import { IAnswer, IMessage } from "@/common/types/chat";
import { Display } from "../Display";
import Inputsform from "./Inputsform";
import AccordionMessageHeader from "./AccordionMessageHeader";
import type { Templates, UpdatedQuestionTemplate } from "@/core/api/dto/templates";
import FeedbackThumbs from "../FeedbackThumbs";
import Fade from "@mui/material/Fade";
import { IPromptInput } from "@/common/types/prompt";

type Modes = "input" | "execution";
interface Props {
  inputs: IPromptInput[];
  answers: IAnswer[];
  onChange: (value: string | File, input: IPromptInput) => void;
  onClear: () => void;
  onGenerate: () => void;
  abortGenerating: () => void;
  showGenerate: boolean;
  template: Templates;
  setMessages: Dispatch<SetStateAction<IMessage[]>>;
  onScrollToBottom: () => void;
  setIsSimulationStreaming: Dispatch<SetStateAction<boolean>>;
}

export const AccordionMessage = ({
  template,
  inputs,
  answers,
  onChange,
  onClear,
  onGenerate,
  abortGenerating,
  showGenerate,
  setMessages,
  onScrollToBottom,
  setIsSimulationStreaming,
}: Props) => {
  const isGenerating = useAppSelector(state => state.template.isGenerating);
  const mode = useAppSelector(state => state.template.accordionChatMode);

  const [expanded, setExpanded] = useState(true);
  const accordionRef = useRef<HTMLDivElement>(null);

  const handleExpandChange = (isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

  const handleShowAccordion = () => {
    setIsSimulationStreaming(false);
    // onScrollToBottom();
  };

  const selectedExecution = useAppSelector(state => state.executions.selectedExecution);

  return (
    <Fade
      in={true}
      unmountOnExit
      timeout={800}
      onTransitionEnd={handleShowAccordion}
    >
      <Accordion
        ref={accordionRef}
        elevation={0}
        expanded={expanded}
        onChange={(_e, isExpanded) => handleExpandChange(isExpanded)}
      >
        <AccordionMessageHeader
          template={template}
          setMessages={setMessages}
          selectedExecution={selectedExecution}
          onClear={onClear}
          showClear={Boolean(answers.length)}
          showGenerate={showGenerate}
          isExpanded={expanded}
          onGenerate={onGenerate}
          onCancel={abortGenerating}
          mode={mode}
        />

        <AccordionDetails
          sx={{
            mt: -4,
            pt: "32px",
            bgcolor: "surface.2",
            borderRadius: "0px 16px 16px 16px",
          }}
        >
          <Stack>
            <Typography
              borderRadius={"8px"}
              bgcolor={"#375CA9"}
              p={"10px 8px 16px 16px"}
              color={"white"}
              lineHeight={"100%"}
              letterSpacing={"1px"}
              fontSize={"10px"}
              textTransform={"uppercase"}
            >
              {isGenerating ? "Generation Result" : "PROMPT Template information"}
            </Typography>
            <Stack
              mt={-1}
              bgcolor={"surface.1"}
              borderRadius={"8px"}
              position={"relative"}
              padding={mode === "execution" ? "16px 64px 48px 64px" : undefined}
            >
              {mode === "execution" && (
                <>
                  <Display
                    mode="chat"
                    templateData={template}
                    close={() => {
                      console.log("close");
                    }}
                  />
                  {!isGenerating && selectedExecution && (
                    <Stack
                      direction={"column"}
                      alignItems={"center"}
                      position={"absolute"}
                      top={"40%"}
                      right={"10px"}
                    >
                      <FeedbackThumbs execution={selectedExecution!} />
                    </Stack>
                  )}
                </>
              )}
              {mode === "input" && (
                <Inputsform
                  inputs={inputs}
                  answers={answers}
                  onChange={onChange}
                />
              )}
            </Stack>
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Fade>
  );
};
