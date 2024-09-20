import React, { useState } from "react";
import { Box, Button, Divider, Stack } from "@mui/material";
import { IEngineParams } from "@/common/types/builder";
import { ParamSliderInline } from "../design-system/ParamSliderInline";

interface Props {
  engineParams: IEngineParams | null | undefined;
  onSave: (params: IEngineParams) => void;
  onCancel: () => void;
  engineDefaultParams?: IEngineParams;
}

function EngineParamsSlider({ engineParams, onSave, engineDefaultParams, onCancel }: Props) {
  const [params, setParams] = useState<IEngineParams>({
    temperature: engineParams?.temperature ?? 0,
    maximumLength: engineParams?.maximumLength ?? 1000,
    topP: engineParams?.topP ?? 0,
    presencePenalty: engineParams?.presencePenalty ?? 0,
    frequencyPenalty: engineParams?.frequencyPenalty ?? 0,
  });

  const maxParams: { [key in keyof IEngineParams]: number } = {
    temperature: engineDefaultParams?.temperature ?? 0,
    maximumLength: engineDefaultParams?.maximumLength ?? 1000,
    topP: engineDefaultParams?.topP ?? 0,
    presencePenalty: engineDefaultParams?.presencePenalty ?? 0,
    frequencyPenalty: engineDefaultParams?.frequencyPenalty ?? 0,
  };

  const stepParams: { [key in keyof IEngineParams]: number } = {
    temperature: 0.1,
    maximumLength: 1,
    topP: 0.01,
    presencePenalty: 0.01,
    frequencyPenalty: 0.01,
  };

  const paramLabels: { [key in keyof IEngineParams]: string } = {
    temperature: "Temperature",
    maximumLength: "Maximum Length",
    topP: "Top P",
    presencePenalty: "Presence Penalty",
    frequencyPenalty: "Frequency Penalty",
  };

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
          {(Object.keys(params) as Array<keyof IEngineParams>).map(key => (
            <Box
              key={key}
              width="50%"
            >
              <ParamSliderInline
                label={paramLabels[key]}
                value={params[key]}
                max={maxParams[key]}
                step={stepParams[key]}
                onChange={val => setParams(prev => ({ ...prev, [key]: val }))}
              />
            </Box>
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
}

export default EngineParamsSlider;
