import { Dispatch, SetStateAction, useRef, useState } from "react";
import Stack from "@mui/material/Stack";
import Accordion from "@mui/material/Accordion";
import Typography from "@mui/material/Typography";
import AccordionDetails from "@mui/material/AccordionDetails";
import { keyframes } from "@mui/material";

import { useAppSelector } from "@/hooks/useStore";
import { IAnswer } from "@/common/types/chat";
import { Display } from "../Display";
import Inputsform from "./Inputsform";
import AccordionMessageHeader from "./AccordionMessageHeader";
import type { Templates } from "@/core/api/dto/templates";
import FeedbackThumbs from "../FeedbackThumbs";
import Fade from "@mui/material/Fade";
import { IPromptInput } from "@/common/types/prompt";
import { PromptParams, ResOverrides } from "@/core/api/dto/prompts";
import PromptContent from "./PromptContent";

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

  const [showPrompts, setShowPrompts] = useState(false);

  const handleExpandChange = (isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

  const handleShowAccordion = () => {
    setIsSimulationStreaming(false);
  };

  const selectedExecution = useAppSelector(state => state.executions.selectedExecution);

  const expandAnimation = keyframes`
  from { width: 0%; }
  to { width: 20%; }
`;

  const collapseAnimation = keyframes`
  from { width: 20%; }
  to { width: 0%; }
`;

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
          showPrompts={showPrompts}
          toggleShowPrompts={() => setShowPrompts(!showPrompts)}
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
              width={"w00%"}
              bgcolor={"surface.1"}
              borderRadius={"8px"}
              position={"relative"}
            >
              {mode === "execution" && (
                <Stack direction={"row"}>
                  <Stack
                    padding={mode === "execution" ? "16px 64px 48px 64px" : undefined}
                    width={showPrompts ? "80%" : "100%"}
                    position={"relative"}
                  >
                    <Display
                      mode="chat"
                      templateData={template}
                    />
                    {!isGenerating && selectedExecution && (
                      <Stack
                        direction={"column"}
                        alignItems={"center"}
                        position={"absolute"}
                        top={"30%"}
                        right={"10px"}
                      >
                        <FeedbackThumbs execution={selectedExecution} />
                      </Stack>
                    )}
                  </Stack>

                  {showPrompts && (
                    <Stack
                      mt={10}
                      borderLeft={"2px solid #ECECF4"}
                      pl={"20px"}
                      pr={"80px"}
                      display={"flex"}
                      flexDirection={"column"}
                      gap={2}
                      sx={{
                        width: showPrompts ? "20%" : "0%",
                        overflow: "hidden",
                        animation: `${showPrompts ? expandAnimation : collapseAnimation} 300ms forwards`,
                      }}
                    >
                      {template.prompts.map((prompt, index) => {
                        index++; // Start with 1
                        return (
                          <PromptContent
                            key={prompt.id}
                            execution={selectedExecution}
                            prompt={prompt}
                            answers={answers}
                            id={index}
                          />
                        );
                      })}
                    </Stack>
                  )}
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
