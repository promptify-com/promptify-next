import { Dispatch, SetStateAction, useRef, useState } from "react";
import Stack from "@mui/material/Stack";
import Accordion from "@mui/material/Accordion";
import Typography from "@mui/material/Typography";
import AccordionDetails from "@mui/material/AccordionDetails";
import Fade from "@mui/material/Fade";

import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { IAnswer } from "@/common/types/chat";
import { Display } from "../Display";
import Form from "./Form";
import AccordionMessageHeader from "./AccordionMessageHeader";
import type { Templates } from "@/core/api/dto/templates";
import type { IPromptInput } from "@/common/types/prompt";
import type { PromptParams, ResOverrides } from "@/core/api/dto/prompts";
import Button from "@mui/material/Button";
import { setAccordionChatMode } from "@/core/store/templatesSlice";
import PlayCircle from "@mui/icons-material/PlayCircle";

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
  accordionChatMode: "input" | "execution";
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
  accordionChatMode,
}: Props) => {
  const dispatch = useAppDispatch();
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
        sx={{ p: 0 }}
      >
        <AccordionMessageHeader
          template={template}
          onClear={onClear}
          showClear={Boolean(answers.length)}
          isExpanded={expanded}
          onCancel={abortGenerating}
          mode={accordionChatMode}
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
            >
              {isGenerating ? "Generation Result" : "PROMPT Template information"}
            </Typography>

            <Stack
              mt={"-10px"}
              bgcolor={"surface.1"}
              borderRadius={"8px"}
              position={"relative"}
            >
              {accordionChatMode === "execution" && (
                <Stack
                  padding={{ xs: "0px 8px", md: "16px 0px 48px 64px" }}
                  position={"relative"}
                >
                  <Display
                    templateData={template}
                    answers={answers}
                  />
                </Stack>
              )}
              {accordionChatMode === "input" && (
                <Form
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
          {showGenerate && accordionChatMode === "input" && (
            <Stack
              direction={"row"}
              justifyContent={"end"}
              mr={3}
            >
              <Button
                onClick={event => {
                  dispatch(setAccordionChatMode("execution"));
                  onGenerate();
                }}
                endIcon={<PlayCircle />}
                sx={{
                  height: "22px",
                  p: { xs: "12px", md: "15px" },
                  fontSize: { xs: 12, md: 15 },
                  lineHeight: "110%",
                  letterSpacing: "0.2px",
                  fontWeight: 500,
                  color: showGenerate ? "primary" : "onSurface",
                  ":hover": {
                    bgcolor: "action.hover",
                  },
                }}
                variant={"contained"}
              >
                Run prompts
              </Button>
            </Stack>
          )}
        </AccordionDetails>
      </Accordion>
    </Fade>
  );
};
