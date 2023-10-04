import { IEditPrompts } from "@/common/types/builder";
import { EnginesGroups } from "@/components/common/forms/EnginesGroups";
import { ArrowDropDown, ContentCopy, DeleteOutline, Menu, Settings } from "@mui/icons-material";
import { Button, IconButton, Popover, Stack, Tooltip, Typography } from "@mui/material";
import React, { useState } from "react";
import { EngineParamsSlider } from "../EngineParamsSlider";
import { Engine } from "@/core/api/dto/templates";

interface Props {
  prompt: IEditPrompts;
  order: number;
  setPrompt: (prompt: IEditPrompts) => void;
  deletePrompt: () => void;
  duplicatePrompt: () => void;
  engines: Engine[];
}

export const Header = ({ prompt, order, setPrompt, deletePrompt, duplicatePrompt, engines }: Props) => {
  const [showEngines, setShowEngines] = useState(false);
  const [enginesAnchor, setEnginesAnchor] = useState<HTMLElement | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsAnchor, setSettingsAnchor] = useState<HTMLElement | null>(null);

  const closeEnginesModal = () => {
    setEnginesAnchor(null);
    setShowEngines(false);
  };

  const closeSettingsModal = () => {
    setSettingsAnchor(null);
    setShowSettings(false);
  };

  const promptEngine = engines?.find(engine => engine.id === prompt.engine_id);

  return (
    <>
      <Stack
        direction={"row"}
        alignItems={"center"}
        gap={2}
        p={"12px"}
      >
        <Menu
          sx={{
            width: 24,
            height: 24,
            opacity: 0.3,
            cursor: "pointer",
            ":hover": {
              opacity: 1,
            },
          }}
        />
        <Typography>#{order}</Typography>
        <Button
          endIcon={<ArrowDropDown />}
          onClick={e => {
            setEnginesAnchor(e.currentTarget);
            setShowEngines(true);
          }}
          sx={{
            fontSize: 16,
            fontWeight: 400,
            color: "text.primary",
            alignItems: "center",
            gap: 0.5,
            px: "8px",
          }}
        >
          <img
            src={promptEngine?.icon}
            alt={promptEngine?.name}
            loading="lazy"
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
            }}
          />
          <Typography
            component={"span"}
            sx={{
              fontSize: "inherit",
              fontWeight: "inherit",
              color: "inherit",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {promptEngine?.name}
          </Typography>
        </Button>
        <IconButton
          onClick={e => {
            setSettingsAnchor(e.currentTarget);
            setShowSettings(true);
          }}
          sx={{
            border: "none",
            "&:hover": {
              bgcolor: "surface.2",
            },
          }}
        >
          <Settings sx={{ width: 24, height: 24 }} />
        </IconButton>
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 400,
            color: "onSurface",
            opacity: 0.5,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          Max Length: {prompt.model_parameters?.maximumLength || 0}, Temperature:{" "}
          {prompt.model_parameters?.temperature || 0}, Top P: {prompt.model_parameters?.topP || 0}, Frequency Penalty:{" "}
          {prompt.model_parameters?.frequencyPenalty || 0}, Presence Penalty:{" "}
          {prompt.model_parameters?.presencePenalty || 0}
        </Typography>
        <Stack
          direction={"row"}
          alignItems={"center"}
          ml={"auto"}
          gap={1}
        >
          <Tooltip
            title="Duplicate"
            placement="top"
          >
            <IconButton
              onClick={duplicatePrompt}
              sx={{
                border: "none",
                "&:hover": {
                  bgcolor: "surface.2",
                },
              }}
            >
              <ContentCopy sx={{ width: 20, height: 20 }} />
            </IconButton>
          </Tooltip>
          <Tooltip
            title="Delete"
            placement="top"
          >
            <IconButton
              onClick={deletePrompt}
              sx={{
                border: "none",
                "&:hover": {
                  bgcolor: "surface.2",
                },
              }}
            >
              <DeleteOutline sx={{ width: 20, height: 20 }} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
      <Popover
        open={showEngines}
        anchorEl={enginesAnchor}
        onClose={closeEnginesModal}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        sx={{
          height: "480px",
          maxHeight: "60svh",
          maxWidth: "60svw",
          ".MuiPaper-root": {
            height: "100%",
          },
        }}
      >
        <EnginesGroups
          engines={engines}
          onChange={engine => {
            setPrompt({ ...prompt, engine_id: engine.id });
            closeEnginesModal();
          }}
        />
      </Popover>
      <Popover
        open={showSettings}
        anchorEl={settingsAnchor}
        onClose={closeSettingsModal}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        sx={{
          height: "480px",
          maxHeight: "60svh",
          width: "530px",
          maxWidth: "60svw",
          ".MuiPaper-root": {
            width: "100%",
          },
        }}
      >
        <EngineParamsSlider
          engineParams={prompt.model_parameters}
          onSave={params => {
            setPrompt({ ...prompt, model_parameters: params });
            closeSettingsModal();
          }}
          onCancel={closeSettingsModal}
        />
      </Popover>
    </>
  );
};
