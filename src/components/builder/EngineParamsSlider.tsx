import React, { useState } from "react";
import { Box, Button, Divider, Stack } from "@mui/material";
import { IEngineParams } from "@/common/types/builder";
import { ParamSliderInline } from "../design-system/ParamSliderInline";

interface Props {
  engineParams: IEngineParams | null | undefined;
  onSave: (params: IEngineParams) => void;
  onCancel: () => void;
}

function EngineParamsSlider({ engineParams, onSave, onCancel }: Props) {
  const [params, setParams] = useState<IEngineParams>({
    temperature: engineParams?.temperature || 0,
    maximumLength: engineParams?.maximumLength || 0,
    topP: engineParams?.topP || 0,
    presencePenalty: engineParams?.presencePenalty || 0,
    frequencyPenalty: engineParams?.frequencyPenalty || 0,
  });

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
          {Object.entries(params).map((param, i) => (
            <Box
              key={i}
              width={"50%"}
            >
              <ParamSliderInline
                label={param[0]}
                value={param[1]}
                onChange={val => setParams(prevParams => ({ ...prevParams, [param[0]]: val }))}
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
