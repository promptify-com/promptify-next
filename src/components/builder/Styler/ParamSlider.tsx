import React from "react";
import { Box, Typography, Slider, Stack, IconButton } from "@mui/material";
import { IPromptParams } from "@/common/types/builder";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityIconOff from "@mui/icons-material/VisibilityOff";
import { DeleteOutline, LockOpen } from "@mui/icons-material";
import LockIcon from "@mui/icons-material/Lock";
import { theme } from "@/theme";
import { StylerVersions } from "./Styler";

interface IProps {
  promptParams: IPromptParams[] | undefined;
  handleChangeScore: (val1: number, val2: number) => void;
  handleChangeOptions: (parameterId: number, option: string, newVal: boolean) => void;
  removeParam: (paramId: number) => void;
  version?: StylerVersions;
}

export const ParamSlider = ({
  promptParams,
  handleChangeScore,
  handleChangeOptions,
  removeParam,
  version = "v1",
}: IProps) => {
  return (
    <Stack gap={2}>
      {promptParams &&
        promptParams.map((param, i) => {
          return (
            <Box
              key={i}
              sx={{
                padding: version === "v1" ? 0 : "8px 16px",
              }}
            >
              <Stack
                direction={"row"}
                alignItems={"baseline"}
                gap={3}
              >
                <Stack
                  gap={1}
                  direction={version === "v1" ? "column" : "row"}
                  alignItems={version === "v1" ? "flex-start" : "center"}
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
                    {version === "v2" && (
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
                  direction={version === "v1" ? "column" : "row"}
                  alignSelf={version === "v1" ? "baseline" : "center"}
                  alignItems={"flex-end"}
                  gap={1}
                >
                  <IconButton
                    onClick={() => removeParam(param.parameter_id)}
                    sx={{
                      ...IconButtonStyles,
                      order: version === "v1" ? 0 : 1,
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
              {version === "v1" && (
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
