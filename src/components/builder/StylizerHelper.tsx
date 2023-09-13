import React, { useState } from "react";
import { Box, Typography, Slider, Stack, IconButton } from "@mui/material";
import { IPromptParams } from "@/common/types/builder";
import { IParameters } from "@/common/types";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityIconOff from "@mui/icons-material/VisibilityOff";
import { DeleteOutline, LockOpen } from "@mui/icons-material";
import LockIcon from "@mui/icons-material/Lock";
import DeleteIcon from "@mui/icons-material/Delete";
import { theme } from "@/theme";

interface IProps {
  parameters: IParameters[];
  promptParams: IPromptParams[] | undefined;
  handleChangeScore: (val1: number, val2: number) => void;
  handleChangeOptions: (parameterId: number, option: string, newVal: boolean) => void;
  removeParam: (paramId: number) => void;
}

export const StylizerHelper = ({
  parameters,
  promptParams,
  handleChangeScore,
  handleChangeOptions,
  removeParam,
}: IProps) => {
  const getDescriptionName = (id: number) => {
    const parameter = parameters.find(param => param.id === id);
    return parameter?.name || "";
  };

  const getDescription = (id: number) => {
    if (promptParams && parameters) {
      const parameter = parameters.filter(param => param.id === id)[0]?.score_descriptions;
      const allDescriptions = promptParams.find(description => {
        return description.parameter_id === id;
      });
      const currentScore = allDescriptions?.score;
      const description = parameter?.find(item => item.score === currentScore);
      return description?.description || "";
    }
  };

  return (
    <Stack gap={2}>
      {promptParams &&
        promptParams.map((param, i) => {
          return (
            <Box key={i}>
              <Stack
                direction={"row"}
                alignItems={"baseline"}
                gap={2}
              >
                <Stack
                  gap={1}
                  sx={{
                    flex: 1,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 16,
                      fontWeight: 500,
                      color: "onSurface",
                    }}
                  >
                    {getDescriptionName(param.parameter_id)}
                  </Typography>
                  <Slider
                    sx={{ color: theme.palette.onSurface }}
                    step={1}
                    marks
                    size="small"
                    min={1}
                    max={6}
                    value={param.score}
                    onChange={(e: any) => handleChangeScore(e.target.value as number, param.parameter_id)}
                  />
                </Stack>
                <Stack
                  alignItems={"flex-end"}
                  gap={1}
                >
                  <IconButton
                    onClick={() => removeParam(param.parameter_id)}
                    sx={IconButtonStyles}
                  >
                    <DeleteOutline sx={{ fontSize: 20 }} />
                  </IconButton>
                  <Stack
                    direction={"row"}
                    alignItems={"center"}
                    gap={1}
                  >
                    <IconButton
                      onClick={() => handleChangeOptions(param.parameter_id, "is_editable", !param.is_editable)}
                      sx={IconButtonStyles}
                    >
                      {param.is_editable ? <LockOpen /> : <LockIcon />}
                    </IconButton>
                    <IconButton
                      onClick={() => handleChangeOptions(param.parameter_id, "is_visible", !param.is_visible)}
                      sx={IconButtonStyles}
                    >
                      {param.is_visible ? <VisibilityIcon /> : <VisibilityIconOff />}
                    </IconButton>
                  </Stack>
                </Stack>
              </Stack>
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 400,
                  color: "onSurface",
                  my: "8px",
                }}
              >
                {getDescription(param.parameter_id)}
              </Typography>
            </Box>
          );
        })}
    </Stack>
  );
};

const IconButtonStyles = {
  border: "none",
  "&:hover": {
    backgroundColor: "surface.2",
  },
  svg: {
    width: 20,
    height: 20,
  },
};
