import { useEffect, useState } from "react";
import Close from "@mui/icons-material/Close";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

import MessageBoxHeader from "@/components/Chat/Messages/MessageBoxHeader";
import FormInputs from "@/components/Prompt/Common/Chat/Form";
import FormPromptContent from "@/components/Chat/FormPromptContent";
import { setChatMode, initialState as initialChatState } from "@/core/store/chatSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import type { Templates } from "@/core/api/dto/templates";
import RunButton from "../RunButton";
import useBrowser from "@/hooks/useBrowser";

interface Props {
  content: string;
  template: Templates;
  onGenerate: () => void;
  onScrollToBottom: () => void;
}

function FormMessageBox({ content, template, onGenerate, onScrollToBottom }: Props) {
  const { isMobile } = useBrowser();
  const dispatch = useAppDispatch();

  const { inputs, answers } = useAppSelector(state => state.chat ?? initialChatState);
  const [expanded, setExpanded] = useState(true);
  const [formMode, setFormMode] = useState<"INPUT" | "PROMPT_CONTENT">("INPUT");

  useEffect(() => {
    setTimeout(() => {
      onScrollToBottom();
    }, 400);
  }, [expanded]);

  const allRequiredInputsAnswered = (): boolean => {
    const requiredQuestionNames = inputs.filter(question => question.required).map(question => question.name);
    if (!requiredQuestionNames.length) {
      return true;
    }
    const answeredQuestionNamesSet = new Set(answers.map(answer => answer.inputName));
    return requiredQuestionNames.every(name => answeredQuestionNamesSet.has(name));
  };

  const allowGenerate = allRequiredInputsAnswered();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      console.log(event.key);
      if (event.key === "Enter" && allowGenerate) {
        onGenerate();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <Stack>
      <Typography
        fontSize={16}
        lineHeight={"25.6px"}
        fontWeight={400}
        letterSpacing={"0.17px"}
        display={"flex"}
        alignItems={"center"}
        color={"onSurface"}
      >
        {content}
      </Typography>
      <Stack>
        <Accordion
          expanded={expanded}
          sx={{ bgcolor: "transparent", p: 0, m: 0 }}
          elevation={0}
        >
          <AccordionSummary sx={{ p: 0, m: 0 }}>
            <MessageBoxHeader
              template={template}
              variant="FORM"
              onExpand={() => {
                setExpanded(true);
                dispatch(setChatMode("messages"));
              }}
              onGenerate={onGenerate}
              showRunButton={allowGenerate}
            />
          </AccordionSummary>

          <AccordionDetails sx={{ p: 0 }}>
            <Stack
              mt={"15px"}
              bgcolor={"surface.4"}
              borderRadius={"24px"}
              position={"relative"}
            >
              <Stack
                bgcolor={"surface.2"}
                overflow={"hidden"}
                borderRadius={"24px"}
              >
                <Stack
                  p={{ xs: "8px 16px", md: "16px 24px" }}
                  borderBottom={"1px solid"}
                  borderColor={"surfaceContainerHigh"}
                  direction={"row"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                >
                  <Typography
                    fontSize={{ xs: 14, md: 16 }}
                    lineHeight={"18px"}
                  >
                    Prompt instruction:
                  </Typography>
                  <Stack
                    direction={"row"}
                    gap={2}
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          defaultChecked
                          onChange={() =>
                            setFormMode(prevState => (prevState === "INPUT" ? "PROMPT_CONTENT" : "INPUT"))
                          }
                        />
                      }
                      label={!isMobile ? "Form mode" : ""}
                      sx={{
                        fontSize: 12,
                      }}
                      labelPlacement="start"
                    />
                    <Button
                      startIcon={<Close />}
                      variant="text"
                      onClick={() => {
                        setExpanded(false);
                        dispatch(setChatMode("automation"));
                      }}
                      sx={{
                        color: "onSurface",
                        minWidth: { xs: "40px", md: "auto" },
                        p: { xs: 1, md: "4px 20px" },
                        "&:hover": {
                          bgcolor: "action.hover",
                        },
                      }}
                    >
                      {!isMobile && "Close"}
                    </Button>
                  </Stack>
                </Stack>
                <Stack sx={formContainerStyle}>
                  {formMode === "INPUT" ? (
                    <FormInputs
                      messageType={"form"}
                      template={template}
                    />
                  ) : (
                    <FormPromptContent template={template} />
                  )}
                </Stack>
              </Stack>
              {allowGenerate && (
                <Stack
                  p={"16px 24px"}
                  direction={"row"}
                  justifyContent={"flex-start"}
                >
                  <RunButton onClick={onGenerate} />
                </Stack>
              )}
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Stack>
    </Stack>
  );
}

const formContainerStyle = {
  overflowY: "auto",
  overflowX: "hidden",
  maxHeight: "370px",
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
    backgroundColor: "surfaceContainerHighest",
    opacity: 0.6,
    outline: "1px solid surface.1",
    borderRadius: "10px",
  },
};

export default FormMessageBox;
