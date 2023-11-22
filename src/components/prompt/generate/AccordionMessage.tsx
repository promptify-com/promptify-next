import { Dispatch, SetStateAction, useState } from "react";

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

import useTimestampConverter from "@/hooks/useTimestampConverter";

type Modes = "input" | "execution";
interface Props {
  questions: UpdatedQuestionTemplate[];
  answers: IAnswer[];
  onChange: (value: string | File, question: UpdatedQuestionTemplate) => void;
  onClear: () => void;
  onGenerate: () => void;
  abortGenerating: () => void;
  showGenerate: boolean;
  template: Templates;
  setMessages: Dispatch<SetStateAction<IMessage[]>>;
}

export const AccordionMessage = ({
  template,
  questions,
  answers,
  onChange,
  onClear,
  onGenerate,
  abortGenerating,
  showGenerate,
  setMessages,
}: Props) => {
  const isGenerating = useAppSelector(state => state.template.isGenerating);
  const mode = useAppSelector(state => state.template.accordionChatMode);

  const [expanded, setExpanded] = useState(true);

  const handleExpandChange = (isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

  const { convertedTimestamp } = useTimestampConverter();
  const createdAt = convertedTimestamp(new Date());

  const selectedExecution = useAppSelector(state => state.executions.selectedExecution);
  const generatedExecution = useAppSelector(state => state.executions.generatedExecution);

  return (
    <Accordion
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
                    right={"0"}
                  >
                    <FeedbackThumbs execution={selectedExecution!} />
                  </Stack>
                )}
              </>
            )}
            {mode === "input" && (
              <Inputsform
                questions={questions}
                answers={answers}
                onChange={onChange}
              />
            )}
          </Stack>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};
