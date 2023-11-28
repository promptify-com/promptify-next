import { Dispatch, SetStateAction, useRef, useState } from "react";
import Stack from "@mui/material/Stack";
import Accordion from "@mui/material/Accordion";
import Typography from "@mui/material/Typography";
import AccordionDetails from "@mui/material/AccordionDetails";
import Fade from "@mui/material/Fade";

import { useAppSelector } from "@/hooks/useStore";
import { IAnswer } from "@/common/types/chat";
import { Display } from "../Display";
import Inputsform from "./Inputsform";
import AccordionMessageHeader from "./AccordionMessageHeader";
import type { Templates } from "@/core/api/dto/templates";
import type { IPromptInput } from "@/common/types/prompt";
import type { PromptParams, ResOverrides } from "@/core/api/dto/prompts";

interface Props {
  inputs: IPromptInput[];
  params: PromptParams[];
  paramsValues: ResOverrides[];
  answers: IAnswer[];
  onChangeInput: (value: string | File, input: IPromptInput) => void;
  onChangeParam: (value: number, param: PromptParams) => void;
  onClear: () => void;
  onGenerate: () => void;
  abortGenerating: () => void;
  showGenerate: boolean;
  template: Templates;
  setIsSimulationStreaming: Dispatch<SetStateAction<boolean>>;
}

export const AccordionMessage = ({
  template,
  inputs,
  params,
  paramsValues,
  answers,
  onChangeInput,
  onChangeParam,
  onClear,
  onGenerate,
  abortGenerating,
  showGenerate,
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
  };

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
              mt={"-10px"}
              bgcolor={"surface.1"}
              borderRadius={"8px"}
              position={"relative"}
            >
              {mode === "execution" && (
                <Stack
                  padding={mode === "execution" ? "16px 0px 48px 64px" : undefined}
                  position={"relative"}
                >
                  <Display
                    mode="chat"
                    templateData={template}
                    answers={answers}
                  />
                </Stack>
              )}
              {mode === "input" && (
                <Inputsform
                  inputs={inputs}
                  params={params}
                  paramsValues={paramsValues}
                  answers={answers}
                  onChangeInput={onChangeInput}
                  onChangeParam={onChangeParam}
                />
              )}
            </Stack>
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Fade>
  );
};
