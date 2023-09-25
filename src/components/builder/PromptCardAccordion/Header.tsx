import { Prompts } from "@/core/api/dto/prompts";
import { theme } from "@/theme";
import { ArrowDropDown, Menu, MoreVert, Settings } from "@mui/icons-material";
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

interface Props {
  prompt: Prompts;
}

export const Header = ({ prompt }: Props) => {
  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      gap={2}
    >
      <Menu
        sx={{
          width: 24,
          height: 24,
          opacity: 0.3,
          ":hover": {
            opacity: 1,
          },
        }}
      />
      <Typography>#{prompt.order}</Typography>
      <Button endIcon={<ArrowDropDown />}>
        <img
          src={prompt.engine.icon}
          alt={prompt.engine.name}
          loading="lazy"
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "50%",
          }}
        />
        {prompt.engine.name}
      </Button>
      <Stack
        flex={1}
        direction={"row"}
        alignItems={"center"}
        justifyContent={"flex-end"}
        gap={1}
      >
        {prompt.model_parameters && (
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 400,
              color: "onSurface",
              opacity: 0.5,
              whiteSpace: "nowrap",
              width: "200px",
              overflow: "hidden",
            }}
          >
            Max Length: {prompt.model_parameters.maximumLength || 0}, Temperature:{" "}
            {prompt.model_parameters.temperature || 0}, Top P: {prompt.model_parameters.topP || 0}, Frequency Penalty:{" "}
            {prompt.model_parameters.frequencyPenalty || 0}, Presence Penalty:{" "}
            {prompt.model_parameters.presencePenalty || 0}
          </Typography>
        )}
        <IconButton
          onClick={() => {}}
          sx={{
            border: "none",
            "&:hover": {
              bgcolor: "surface.2",
            },
          }}
        >
          <Settings sx={{ width: 24, height: 24 }} />
        </IconButton>
        <IconButton
          onClick={() => {}}
          sx={{
            border: "none",
            "&:hover": {
              bgcolor: "surface.2",
            },
          }}
        >
          <MoreVert sx={{ width: 24, height: 24 }} />
        </IconButton>
      </Stack>
    </Stack>
  );
};
