import DramaMasks from "@/assets/icons/DramaMasks";
import { Prompts } from "@/core/api/dto/prompts";
import { theme } from "@/theme";
import { AddCircle, ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  IconButton,
  Stack,
  Typography,
  alpha,
} from "@mui/material";
import React from "react";
import { Styler } from "../Styler/Styler";
import { IEditPrompts } from "@/common/types/builder";

interface Props {
  prompt: IEditPrompts;
  setPrompt: (prompt: IEditPrompts) => void;
}

export const StylerAccordion = ({ prompt, setPrompt }: Props) => {
  return (
    <Accordion
      key={prompt.id}
      sx={{
        m: "0 24px !important",
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: "24px !important",
        bgcolor: "surface.1",
        boxShadow: "none",
        ":before": { display: "none" },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        sx={{
          ".MuiAccordionSummary-content": {
            m: 0,
            alignItems: "center",
            gap: 2,
          },
          "&.Mui-expanded": {
            minHeight: "48px !important",
          },
        }}
      >
        <DramaMasks
          size="20"
          color={theme.palette.action.active}
        />
        <Stack
          direction={"row"}
          alignItems={"center"}
          flexWrap={"wrap"}
          gap={0.5}
        >
          <Typography
            sx={{
              fontSize: 15,
              fontWeight: 500,
              color: "onSurface",
            }}
          >
            Style options:
          </Typography>
          {prompt.parameters.slice(0, 1).map(param => (
            <Chip
              key={param.parameter_id}
              label={param.name}
              sx={{
                height: "fit-content",
                p: "3px 4px",
                fontSize: 13,
                fontWeight: 400,
              }}
            />
          ))}
          <IconButton
            onClick={() => {}}
            sx={{
              border: "none",
              fontSize: 13,
              fontWeight: 500,
              borderRadius: "999px",
              gap: 1,
              p: "3px 8px",
              "&:hover": {
                bgcolor: "surface.2",
              },
            }}
          >
            <AddCircle sx={{ width: 18, height: 18, color: alpha(theme.palette.text.secondary, 0.45) }} />
            Add
          </IconButton>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Styler
          selectedNodeData={prompt}
          setSelectedNodeData={setPrompt}
          version="v2"
        />
      </AccordionDetails>
    </Accordion>
  );
};
