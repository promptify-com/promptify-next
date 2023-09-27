import { IEditPrompts } from "@/common/types/builder";
import { EnginesGroups } from "@/components/common/forms/EnginesGroups";
import { useGetEnginesQuery } from "@/core/api/engines";
import { ArrowDropDown, Menu, MoreVert, Settings } from "@mui/icons-material";
import { Button, IconButton, Popover, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { EngineParamsSlider } from "../EngineParamsSlider";

interface Props {
  prompt: IEditPrompts;
}

export const Header = ({ prompt }: Props) => {
  const { data: engines } = useGetEnginesQuery();
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
        width={"100%"}
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
          {promptEngine?.name}
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
          onChange={engine => {
            console.log(engine);
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
            console.log(params);
            closeSettingsModal();
          }}
          onCancel={closeSettingsModal}
        />
      </Popover>
    </>
  );
};
