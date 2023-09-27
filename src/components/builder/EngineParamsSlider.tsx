import React, { useState } from "react";
import { Box, Button, Divider, Slider, Stack, Typography } from "@mui/material";
import { IEngineParams } from "@/common/types/builder";
import { theme } from "@/theme";

const getParamLabel = (name: string) => {
  switch (name) {
    case "temperature":
      return "Temperature";
    case "maximumLength":
      return "Maximum Length";
    case "topP":
      return "Top P";
    case "presencePenalty":
      return "Presence Penalty";
    case "frequencyPenalty":
      return "Frequency Penalty";
    default:
      return name;
  }
};

interface Props {
  engineParams: IEngineParams | null | undefined;
  onSave: (params: IEngineParams) => void;
  onCancel: () => void;
}

export const EngineParamsSlider: React.FC<Props> = ({ engineParams, onSave, onCancel }) => {
  const [params, setParams] = useState<IEngineParams>({
    temperature: engineParams?.temperature || 0,
    maximumLength: engineParams?.maximumLength || 0,
    topP: engineParams?.topP || 0,
    presencePenalty: engineParams?.presencePenalty || 0,
    frequencyPenalty: engineParams?.frequencyPenalty || 0,
  });

  const setParam = (name: string, val: number) => {
    setParams({
      ...params,
      [name]: val,
    });
  };

  const CustomSlider = (name: string, value = 0) => (
    <Box p={"8px 24px"}>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        py={"8px"}
      >
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 500,
            color: "onSurface",
          }}
        >
          {getParamLabel(name)}
        </Typography>
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 400,
            color: "onSurface",
          }}
        >
          {value}
        </Typography>
      </Stack>
      <Slider
        sx={{ color: theme.palette.onSurface }}
        step={1}
        min={0}
        max={100}
        size="small"
        value={value}
        onChange={(e, val) => setParam(name, Number(val))}
      />
    </Box>
  );

  return (
    <Stack height={"100%"}>
      <Box p={"16px"}>Engine settings:</Box>
      <Divider sx={{ borderColor: "surface.3" }} />
      <Box
        sx={{
          overflowY: "auto",
        }}
      >
        <Stack
          direction={"row"}
          flexWrap={"wrap"}
        >
          {Object.entries(params).map(param => (
            <Box width={"50%"}>{CustomSlider(param[0], param[1])}</Box>
          ))}
        </Stack>
      </Box>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"flex-end"}
        gap={2}
        p={"16px 24px"}
      >
        <Button
          variant="text"
          sx={{
            borderRadius: "4px",
            color: "secondary.main",
          }}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={{
            bgcolor: "secondary.main",
            borderRadius: "4px",
          }}
          onClick={() => onSave(params)}
        >
          Save
        </Button>
      </Stack>
    </Stack>
  );
};
