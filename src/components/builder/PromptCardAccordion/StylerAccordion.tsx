import DramaMasks from "@/assets/icons/DramaMasks";
import { Prompts } from "@/core/api/dto/prompts";
import { theme } from "@/theme";
import { AddCircle, ArrowDropDown, Menu, MoreVert, Settings } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
  alpha,
} from "@mui/material";
import React from "react";

interface Props {
  prompt: Prompts;
}

export const StylerAccordion = ({ prompt }: Props) => {
  return (
    <Accordion
      key={prompt.id}
      defaultExpanded
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
        sx={{
          ".MuiAccordionSummary-content, &.Mui-expanded": {
            m: "0",
            p: "4px 8px 4px 16px",
            alignItems: "center",
            gap: 2,
            minHeight: "48px",
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
              key={param.parameter.id}
              label={param.parameter.name}
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
    </Accordion>
  );
};
