import React, { useState } from "react";
import { Box, Typography, Slider } from "@mui/material";
import { IPromptParams } from "@/common/types/builder";
import { IParameters } from "@/common/types";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityIconOff from "@mui/icons-material/VisibilityOff";
import { LockOpen } from "@mui/icons-material";
import LockIcon from "@mui/icons-material/Lock";
import DeleteIcon from "@mui/icons-material/Delete";

interface IProps {
  parameters: IParameters[];
  promptParams: IPromptParams[] | undefined;
  handleChangeScore: (val1: number, val2: number) => void;
  handleChangeOptions: (
    parameterId: number,
    option: string,
    newVal: boolean
  ) => void;
  removeParam: (paramId: number) => void;
}

export const StylizerHelper = ({
  parameters,
  promptParams,
  handleChangeScore,
  handleChangeOptions,
  removeParam,
}: IProps) => {
  const [hoveredParam, setHoveredParam] = useState<number | null>(null);

  const getDescriptionName = (id: number) => {
    const parameter = parameters.find((param) => param.id === id);
    return parameter?.name || "";
  };

  const getDescription = (id: number) => {
    if (promptParams && parameters) {
      const parameter = parameters.filter((param) => param.id === id)[0]
        .score_descriptions;
      const allDescriptions = promptParams.find((description) => {
        return description.parameter_id === id;
      });
      const currentScore = allDescriptions?.score;
      const description = parameter.find((item) => item.score === currentScore);
      return description?.description || "";
    }
  };

  return (
    <Box
      paddingBottom="25px"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      {promptParams &&
        promptParams.map((param, i) => {
          return (
            <Box
              key={i}
              sx={{
                display: "flex",
                alignItems: "baseline",
                mt: "40px",
                px: " 20px",
              }}
              onMouseOver={() => setHoveredParam(param.parameter_id)}
              onMouseLeave={() => setHoveredParam(null)}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Box
                  onClick={() =>
                    handleChangeOptions(
                      param.parameter_id,
                      "is_editable",
                      !param.is_editable
                    )
                  }
                >
                  {param.is_editable ? (
                    <LockOpen
                      sx={{
                        fontSize: "1rem",
                        color: "white",
                        cursor: "pointer",
                        mr: "8px",
                      }}
                    />
                  ) : (
                    <LockIcon
                      sx={{
                        fontSize: "1rem",
                        color: "white",
                        cursor: "pointer",
                        mr: "8px",
                      }}
                    />
                  )}
                </Box>
                <Box
                  onClick={() =>
                    handleChangeOptions(
                      param.parameter_id,
                      "is_visible",
                      !param.is_visible
                    )
                  }
                >
                  {param.is_visible ? (
                    <VisibilityIcon
                      sx={{
                        fontSize: "1rem",
                        color: "white",
                        cursor: "pointer",
                      }}
                    />
                  ) : (
                    <VisibilityIconOff
                      sx={{
                        fontSize: "1rem",
                        color: "white",
                        cursor: "pointer",
                      }}
                    />
                  )}
                </Box>
              </Box>
              <Box
                sx={{
                  flex: 1,
                  p: "0 5px",
                  mx: "10px",
                }}
              >
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <Typography
                    fontWeight="500"
                    fontSize="1rem"
                    fontFamily="Space Mono"
                    color="white"
                  >
                    {getDescriptionName(param.parameter_id)}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="center" mt="5px">
                  <Slider
                    sx={{
                      color: "white",
                    }}
                    step={1}
                    marks
                    min={1}
                    max={6}
                    value={param.score}
                    onChange={(e: any) =>
                      handleChangeScore(
                        e.target.value as number,
                        param.parameter_id
                      )
                    }
                  />
                </Box>
                <Typography
                  fontWeight="500"
                  fontSize="0.8rem"
                  fontFamily="Space Mono"
                  color="rgba(255, 255, 255, 0.6)"
                  mt="5px"
                >
                  {getDescription(param.parameter_id)}
                </Typography>
              </Box>
              <Box>
                {hoveredParam === param.parameter_id ? (
                  <DeleteIcon
                    sx={{
                      fontSize: "1.2rem",
                      color: "#f85149",
                      cursor: "pointer",
                      opacity: 0.8,
                      ":hover": { opacity: 1 },
                    }}
                    onClick={() => removeParam(hoveredParam)}
                  />
                ) : (
                  <DeleteIcon
                    sx={{ fontSize: "1.2rem", color: "transparent" }}
                  />
                )}
              </Box>
            </Box>
          );
        })}
    </Box>
  );
};
