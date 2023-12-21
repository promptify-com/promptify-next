import { SyntheticEvent, useRef } from "react";
import Stack from "@mui/material/Stack";
import Accordion from "@mui/material/Accordion";
import Typography from "@mui/material/Typography";
import AccordionDetails from "@mui/material/AccordionDetails";
import Fade from "@mui/material/Fade";
import PlayCircle from "@mui/icons-material/PlayCircle";
import Button from "@mui/material/Button";

import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setIsSimulationStreaming } from "@/core/store/chatSlice";
import { Display } from "@/components/Prompt/Common/Display";
import Form from "@/components/Prompt/Common/Chat/Form";
import AccordionMessageHeader from "@/components/Prompt/VariantB/AccordionMessageHeader";
import type { Templates } from "@/core/api/dto/templates";

interface Props {
  onGenerate: () => void;
  abortGenerating: () => void;
  showGenerate: boolean;
  template: Templates;
  type: "spark" | "form";
  onChange?: (event: SyntheticEvent<Element, Event>, expanded: boolean) => void;
  expanded: boolean;
}

export default function AccordionMessage({
  template,
  onGenerate,
  abortGenerating,
  showGenerate,
  type,
  onChange,
  expanded,
}: Props) {
  const dispatch = useAppDispatch();
  const isGenerating = useAppSelector(state => state.template.isGenerating);
  const currentUser = useAppSelector(state => state.user.currentUser);

  const accordionRef = useRef<HTMLDivElement>(null);

  return (
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
        onChange={onChange}
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
            >
              {isGenerating ? "Generation Result" : "PROMPT Template information"}
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
              {type === "form" && <Form />}
            </Stack>
          </Stack>
          {showGenerate && type === "form" && currentUser?.id && (
            <Stack
              direction={"row"}
              justifyContent={"end"}
              mr={3}
            >
              <Button
                onClick={() => {
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
                  bgcolor: "primary.main",
                  borderColor: "primary.main",

                  color: showGenerate ? "primary" : "onSurface",
                  ":hover": {
                    bgcolor: "surface.1",
                    color: "primary.main",
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
}
