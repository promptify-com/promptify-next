import Link from "next/link";
import React from "react";
import Stack from "@mui/material/Stack";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Skeleton from "@mui/material/Skeleton";

import useBrowser from "@/hooks/useBrowser";
import { getWorkflowDataFlow } from "@/components/GPTs/helpers";
import DataFlowSteps from "@/components/common/DataFlowSteps";
import type { ITemplateWorkflow } from "@/components/Automation/types";

interface Props {
  workflow?: ITemplateWorkflow;
  isLoading: boolean;
}

function DataFlowAccordion({ workflow, isLoading }: Props) {
  if (isLoading) {
    return (
      <Skeleton
        variant="rectangular"
        width={"100%"}
        height={120}
        sx={{ mb: 1, borderRadius: "16px", bgcolor: "surfaceContainerLow" }}
      />
    );
  }
  const steps = getWorkflowDataFlow(workflow!);
  const { isMobile } = useBrowser();

  return (
    <Accordion
      defaultExpanded={!isMobile}
      sx={{
        boxShadow: "none",
        px: "8px",
        borderRadius: "24px !important",
        bgcolor: "surfaceContainerLow",
        m: "0 !important",
        "::before": { display: "none" },
        ".MuiAccordionSummary-root": {
          p: "16px 8px",
          fontSize: 14,
          fontWeight: 500,
          color: "onSurface",
        },
        ".MuiAccordionSummary-content": { m: "0 !important" },
        ".MuiAccordionDetails-root": { p: 0 },
      }}
    >
      <AccordionSummary expandIcon={<ExpandMore />}>Data flow:</AccordionSummary>
      <AccordionDetails>
        <Stack
          gap={1}
          alignItems={"center"}
          justifyContent={"center"}
          pb={"20px"}
        >
          <DataFlowSteps steps={steps} />
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}

export default DataFlowAccordion;
