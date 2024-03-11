import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { ReactNode, useState } from "react";

interface Props {
  children: ReactNode;
}

export default function AccordionBox({ children }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Stack
      gap={2}
      alignItems={"flex-start"}
    >
      <Accordion
        expanded={expanded}
        sx={{
          boxShadow: "none",
          ".MuiAccordionSummary-root": { display: "none" },
          ".MuiCollapse-root": { minHeight: "128px !important", visibility: "visible" },
          ".MuiAccordionDetails-root": { p: 0 },
        }}
      >
        <AccordionSummary></AccordionSummary>
        <AccordionDetails>{children}</AccordionDetails>
      </Accordion>
      <Button
        onClick={() => setExpanded(!expanded)}
        sx={{
          border: "1px solid",
          borderColor: "surfaceContainerHigh",
          borderRadius: "99px",
          p: "8px 16px",
          fontSize: { xs: 12, md: 14 },
          fontWeight: 500,
          gap: 0.5,
          color: "onSurface",
          ":hover": {
            bgcolor: "surfaceContainerHigh",
          },
        }}
      >
        {expanded ? "Collapse" : "Expand"}
      </Button>
    </Stack>
  );
}
