import { useState } from "react";
import Close from "@mui/icons-material/Close";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

import MessageBoxHeader from "@/components/Chat/MessageBoxHeader";
import FormInputs from "@/components/Prompt/Common/Chat/Form";
import FormPromptContent from "@/components/Chat/FormPromptContent";
import type { Templates } from "@/core/api/dto/templates";

interface Props {
  content: string;
  template: Templates;
  onGenerate: () => void;
}

function FormMessageBox({ content, template, onGenerate }: Props) {
  const [expanded, setExpanded] = useState(true);
  const [formMode, setFormMode] = useState<"INPUT" | "PROMPT_CONTENT">("INPUT");

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
      <Accordion
        expanded={expanded}
        sx={{ bgcolor: "transparent", p: 0, m: 0 }}
        elevation={0}
      >
        <AccordionSummary sx={{ p: 0, m: 0 }}>
          <MessageBoxHeader
            variant="FORM"
            onExpand={() => setExpanded(true)}
            onGenerate={onGenerate}
          />
        </AccordionSummary>

        <AccordionDetails sx={{ p: 0 }}>
          <Stack
            mt={"20px"}
            bgcolor={"surface.2"}
            borderRadius={"24px"}
            position={"relative"}
          >
            <Stack
              p={"16px 24px"}
              borderBottom={"1px solid"}
              borderColor={"surfaceContainerHigh"}
              direction={"row"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Typography
                fontSize={16}
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
                      onChange={() => setFormMode(prevState => (prevState === "INPUT" ? "PROMPT_CONTENT" : "INPUT"))}
                    />
                  }
                  label="Form mode"
                  labelPlacement="start"
                />
                <Button
                  startIcon={<Close />}
                  variant="text"
                  onClick={() => () => setExpanded(false)}
                  sx={{
                    color: "onSurface",
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  Close
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
        </AccordionDetails>
      </Accordion>
    </Stack>
  );
}

const formContainerStyle = {
  overflowY: "auto",
  overflowX: "hidden",
  maxHeight: "370px",
  px: "8px",
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
