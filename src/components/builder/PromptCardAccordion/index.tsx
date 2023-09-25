import { Prompts } from "@/core/api/dto/prompts";
import { theme } from "@/theme";
import { ArrowDropDown, Menu, MoreVert, PlayCircle, Settings } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { Header } from "./Header";
import { StylerAccordion } from "./StylerAccordion";

interface Props {
  prompt: Prompts;
}

export const PromptCardAccordion = ({ prompt }: Props) => {
  return (
    <Accordion
      key={prompt.id}
      defaultExpanded
      sx={{
        bgcolor: "surface.1",
        m: "24px 0 !important",
        borderRadius: "16px !important",
        boxShadow: "none",
        transition: "box-shadow 0.3s ease-in-out",
        ":before": { display: "none" },
        ":hover": {
          boxShadow:
            "0px 3px 3px -2px rgba(225, 226, 236, 0.20), 0px 3px 4px 0px rgba(225, 226, 236, 0.14), 0px 1px 8px 0px rgba(27, 27, 30, 0.12)",
        },
      }}
    >
      <AccordionSummary
        sx={{
          ".MuiAccordionSummary-content, .Mui-expanded": {
            m: "12px 0 !important",
            alignItems: "center",
            gap: 2,
            minHeight: "42px",
          },
        }}
      >
        <Header prompt={prompt} />
      </AccordionSummary>
      <Divider sx={{ borderColor: "surface.3" }} />
      <AccordionDetails
        sx={{
          p: 0,
        }}
      >
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          p={"8px 16px 8px 24px"}
        >
          <Typography>{prompt.title}</Typography>
          <Button startIcon={<PlayCircle />}>Test run</Button>
        </Stack>
        <Box>
          <Typography
            sx={{
              p: "8px 16px 8px 24px",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: 0.8,
              textTransform: "uppercase",
              color: "text.secondary",
            }}
          >
            Prompt Instructions:
          </Typography>
          <TextField
            multiline
            maxRows={4}
            fullWidth
            variant="outlined"
            name="description"
            value={prompt.content}
            onChange={() => {}}
            InputProps={{
              sx: {
                p: "12px 0 24px 24px",
                ".MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              },
            }}
          />
        </Box>

        <StylerAccordion prompt={prompt} />
      </AccordionDetails>
    </Accordion>
  );
};
