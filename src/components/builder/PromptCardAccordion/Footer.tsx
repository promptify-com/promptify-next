import { IEditPrompts } from "@/common/types/builder";
import { EnginesGroups } from "@/components/common/forms/EnginesGroups";
import { useGetEnginesQuery } from "@/core/api/engines";
import { ArrowDropDown, Menu, MoreVert, Settings, SubdirectoryArrowRight } from "@mui/icons-material";
import { Button, IconButton, Popover, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { EngineParamsSlider } from "../EngineParamsSlider";
import { OutputOptions } from "./OutputOptions";
import ArrowRightBottom from "@/assets/icons/ArrowRightBottom";
import { theme } from "@/theme";

interface Props {
  prompt: IEditPrompts;
  setPrompt: (prompt: IEditPrompts) => void;
}

export const Footer = ({ prompt, setPrompt }: Props) => {
  const [showOptions, setShowOptions] = useState(false);
  const [optionsAnchor, setOptionsAnchor] = useState<HTMLElement | null>(null);

  const closeOptionsModal = () => {
    setOptionsAnchor(null);
    setShowOptions(false);
  };

  return (
    <>
      <Stack
        direction={"row"}
        alignItems={"center"}
        gap={1}
        p={"12px 16px"}
      >
        <ArrowRightBottom
          size="20"
          color={theme.palette.action.active}
          opacity={0.5}
        />
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 500,
            color: "onSurface",
          }}
        >
          Generated content format:
        </Typography>
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 400,
            color: "onSurface",
            opacity: 0.5,
            whiteSpace: "nowrap",
            maxWidth: "200px",
            overflow: "hidden",
          }}
        >
          {prompt.output_format ? prompt.output_format + " ," : ""}
          Visbility: {prompt.is_visible ? "On" : "Off"}, Title: {prompt.prompt_output_variable || "..."}
        </Typography>
        <Button
          variant="text"
          sx={{
            fontSize: 12,
            fontWeight: 400,
            color: "onSurface",
            opacity: 0.5,
            p: 0,
            minWidth: "auto",
            textDecorationLine: "underline",
          }}
          onClick={e => {
            setOptionsAnchor(e.currentTarget);
            setShowOptions(true);
          }}
        >
          Edit
        </Button>
        <Stack
          direction={"row"}
          alignItems={"center"}
          ml={"auto"}
        >
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 500,
              color: "onSurface",
            }}
          >
            Save result as:
          </Typography>
          <Button
            endIcon={<ArrowDropDown />}
            onClick={e => {
              setOptionsAnchor(e.currentTarget);
              setShowOptions(true);
            }}
            sx={{
              fontSize: 13,
              fontWeight: 500,
              color: "#9C27B0",
            }}
          >
            {prompt.prompt_output_variable || "..."}
          </Button>
        </Stack>
      </Stack>
      <Popover
        open={showOptions}
        anchorEl={optionsAnchor}
        onClose={closeOptionsModal}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <OutputOptions
          prompt={prompt}
          onSave={prompt => {
            setPrompt(prompt);
            closeOptionsModal();
          }}
          onCancel={closeOptionsModal}
        />
      </Popover>
    </>
  );
};
