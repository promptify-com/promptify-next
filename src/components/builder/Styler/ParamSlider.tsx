import React from "react";
import { Box, Typography, Slider, Stack, IconButton } from "@mui/material";
import { BuilderType, IPromptParams } from "@/common/types/builder";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityIconOff from "@mui/icons-material/VisibilityOff";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import LockOpen from "@mui/icons-material/LockOpen";
import LockIcon from "@mui/icons-material/Lock";
import { theme } from "@/theme";
import { BUILDER_TYPE } from "@/common/constants";

interface IProps {
  promptParams: IPromptParams[] | undefined;
  handleChangeScore: (val1: number, val2: number) => void;
  handleChangeOptions: (parameterId: number, option: string, newVal: boolean) => void;
  removeParam: (paramId: number) => void;
  type: BuilderType;
}

export const ParamSlider = ({
  promptParams,
  handleChangeScore,
  handleChangeOptions,
  removeParam,
  type = BUILDER_TYPE.ADMIN,
}: IProps) => {
  return (
    <Stack gap={2}>
      {promptParams &&
        promptParams.map((param, i) => {
          return (
            <Box
              key={i}
              sx={{
                padding: type === BUILDER_TYPE.ADMIN ? 0 : "8px 16px",
              }}
            >
              <Stack
                direction={"row"}
                alignItems={"baseline"}
                gap={3}
              >
                <Stack
                  gap={1}
                  direction={type === BUILDER_TYPE.ADMIN ? "column" : "row"}
                  alignItems={type === BUILDER_TYPE.ADMIN ? "flex-start" : "center"}
                  sx={{
                    flex: 1,
                  }}
                >
                  <Box flex={2}>
                    <Typography
                      sx={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: "onSurface",
                      }}
                    >
                      {param.name}
                    </Typography>
                    {type === BUILDER_TYPE.USER && (
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
                    )}
                  </Box>
                  <Slider
                    sx={{ flex: 1.5, color: theme.palette.onSurface }}
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
                  direction={type === BUILDER_TYPE.ADMIN ? "column" : "row"}
                  alignSelf={type === BUILDER_TYPE.ADMIN ? "baseline" : "center"}
                  alignItems={"flex-end"}
                  gap={1}
                >
                  <IconButton
                    onClick={() => removeParam(param.parameter_id)}
                    sx={{
                      ...IconButtonStyles,
                      order: type === BUILDER_TYPE.ADMIN ? 0 : 1,
                    }}
                  >
                    <DeleteOutline sx={{ fontSize: 20 }} />
                  </IconButton>
                  <Stack
                    direction={"row"}
                    alignItems={"center"}
                    gap={1}
                    // order={0}
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
              {type === BUILDER_TYPE.ADMIN && (
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
              )}
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
