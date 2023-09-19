import React from "react";
import { Box, Typography, Slider, Stack, IconButton } from "@mui/material";
import { IPromptParams } from "@/common/types/builder";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityIconOff from "@mui/icons-material/VisibilityOff";
import { DeleteOutline, LockOpen } from "@mui/icons-material";
import LockIcon from "@mui/icons-material/Lock";
import { theme } from "@/theme";

interface IProps {
  promptParams: IPromptParams[] | undefined;
  handleChangeScore: (val1: number, val2: number) => void;
  handleChangeOptions: (parameterId: number, option: string, newVal: boolean) => void;
  removeParam: (paramId: number) => void;
}

export const StylizerHelper = ({ promptParams, handleChangeScore, handleChangeOptions, removeParam }: IProps) => {
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
                    {param.name}
                  </Typography>
                  <Slider
                    sx={{ color: theme.palette.onSurface }}
                    step={1}
                    marks
                    size="small"
                    min={1}
                    max={6}
                    value={param.score}
                    onChange={(e: any) => handleChangeScore(parseInt(e.target.value), param.parameter_id)}
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
                {param.descriptions?.find(desc => desc.score === param.score)?.description}
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
