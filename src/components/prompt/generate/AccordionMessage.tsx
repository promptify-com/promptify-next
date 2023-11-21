import { useState } from "react";

import Stack from "@mui/material/Stack";
import Accordion from "@mui/material/Accordion";
import Typography from "@mui/material/Typography";
import AccordionDetails from "@mui/material/AccordionDetails";

import { useAppSelector } from "@/hooks/useStore";
import { IAnswer } from "@/common/types/chat";
import { Display } from "../Display";
import Inputsform from "./Inputsform";
import AccordionMessageHeader from "./AccordionMessageHeader";
import type { Templates, UpdatedQuestionTemplate } from "@/core/api/dto/templates";

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
}: Props) => {
  const isGenerating = useAppSelector(state => state.template.isGenerating);

  const [expanded, setExpanded] = useState(true);
  const [mode, setMode] = useState<Modes>("input");

  const handleExpandChange = (isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

  return (
    <Accordion
      elevation={0}
      expanded={expanded}
      onChange={(_e, isExpanded) => handleExpandChange(isExpanded)}
    >
      <AccordionMessageHeader
        onClear={onClear}
        showClear={Boolean(answers.length)}
        showGenerate={showGenerate}
        isExpanded={expanded}
        onGenerate={onGenerate}
        onCancel={abortGenerating}
        mode={mode}
        changeMode={setMode}
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
                <Display templateData={template} />
                {!isGenerating && <Stack direction={"column"}></Stack>}
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
