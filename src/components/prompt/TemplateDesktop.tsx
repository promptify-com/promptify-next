import { type Dispatch, type SetStateAction } from "react";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMore from "@mui/icons-material/ExpandMore";
import AccordionDetails from "@mui/material/AccordionDetails";
import { DetailsCard } from "./DetailsCard";
import { Details } from "./Details";
import { GeneratorForm } from "./GeneratorForm";
import { Display } from "./Display";
import type { Templates, TemplatesExecutions } from "@/core/api/dto/templates";

interface TemplateDesktopProps {
  hashedExecution: TemplatesExecutions | null;
  template: Templates;
  setErrorMessage: Dispatch<SetStateAction<string>>;
}

export default function TemplateDesktop({ template, setErrorMessage, hashedExecution }: TemplateDesktopProps) {
  const isTemplatePublished = template?.status === "PUBLISHED";

  return (
    <Grid
      mt={0}
      gap={"8px"}
      container
      flexWrap={"nowrap"}
      mx={"auto"}
      height={"calc(100svh - 90px)"}
      width={"calc(100% - 65px)"}
      position={"relative"}
      overflow={"auto"}
      sx={{
        "&::-webkit-scrollbar": {
          width: "6px",
          p: 1,
          backgroundColor: "surface.5",
        },
        "&::-webkit-scrollbar-track": {
          webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "surface.1",
          outline: "1px solid surface.1",
          borderRadius: "10px",
        },
      }}
    >
      <Stack
        px={"4px"}
        maxWidth={"430px"}
        width={"38%"}
        borderRadius={"16px"}
        position={"sticky"}
        top={0}
        zIndex={100}
        height={"100%"}
        overflow={"auto"}
        sx={{
          "&::-webkit-scrollbar": {
            width: "6px",
            p: 1,
            backgroundColor: "surface.5",
          },
          "&::-webkit-scrollbar-track": {
            webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "surface.1",
            outline: "1px solid surface.1",
            borderRadius: "10px",
          },
        }}
      >
        <DetailsCard templateData={template} />
        <Stack flex={1}>
          <Box flex={1}>
            <Accordion
              key={template?.id}
              sx={{
                mb: -1,
                boxShadow: "none",
                borderRadius: "16px",
                bgcolor: "surface.1",
                overflow: "hidden",
                ".MuiAccordionDetails-root": {
                  p: "0",
                },
                ".MuiAccordionSummary-root": {
                  minHeight: "48px",
                  ":hover": {
                    cursor: isTemplatePublished ? "auto" : "pointer",
                    opacity: 0.8,
                    svg: {
                      color: "primary.main",
                    },
                  },
                },
                ".MuiAccordionSummary-content": {
                  m: 0,
                },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: "primary.main",
                  }}
                >
                  More about template
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Details templateData={template} />
              </AccordionDetails>
            </Accordion>
            <GeneratorForm
              templateData={template}
              onError={setErrorMessage}
            />
          </Box>
        </Stack>
      </Stack>

      <Grid
        flex={1}
        borderRadius={"16px"}
        width={"62%"}
        display={"block"}
      >
        <Grid mr={1}>
          <Display
            templateData={template}
            onError={setErrorMessage}
            hashedExecution={hashedExecution}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
