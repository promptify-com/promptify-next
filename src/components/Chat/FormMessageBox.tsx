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
import Form from "@/components/Prompt/Common/Chat/Form";
import type { Templates } from "@/core/api/dto/templates";

interface Props {
  content: string;
  template: Templates;
}

function FormMessageBox({ content, template }: Props) {
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
        expanded
        sx={{ bgcolor: "transparent", p: 0, m: 0 }}
        elevation={0}
      >
        <AccordionSummary sx={{ p: 0, m: 0 }}>
          <MessageBoxHeader />
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
                  control={<Switch defaultChecked />}
                  label="Form mode"
                  labelPlacement="start"
                />
                <Button
                  startIcon={<Close />}
                  variant="text"
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

            <Form
              messageType={"form"}
              template={template}
            />
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Stack>
  );
}

export default FormMessageBox;
