import React from "react";
import { Box, InputLabel, Slider, Stack, Typography } from "@mui/material";
import { PromptParams, ResOverrides } from "@/core/api/dto/prompts";
import { useAppSelector } from "@/hooks/useStore";

interface GeneratorParamProps {
  param: PromptParams;
  paramValue: ResOverrides | undefined;
  onChange: (value: number, param: PromptParams) => void;
}

export const FormParam: React.FC<GeneratorParamProps> = ({ param, paramValue, onChange }) => {
  const isGenerating = useAppSelector(state => state.template.isGenerating);

  const handleScoreChange = (score: number) => {
    onChange(score, param);
  };

  const matchingContext = paramValue?.contextual_overrides.find(
    contextual_override => contextual_override?.parameter === param.parameter.id,
  );

  const activeScore = matchingContext?.score || param.score;
  const descriptions = param.parameter.score_descriptions;
  const activeDescription = descriptions.find(description => description.score === activeScore);
  const marks = descriptions.map(description => ({ value: description.score }));
  const values = marks.map(obj => obj.value) || [];

  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      justifyContent={"space-between"}
      flexWrap={"wrap"}
      gap={1}
    >
      <Box maxWidth={"60%"}>
        <InputLabel
          sx={{
            fontSize: 14,
            fontWeight: 500,
            color: "#375CA9",
            overflow: "visible",
          }}
        >
          {param.parameter.name}:
        </InputLabel>
        <Typography
          component={"span"}
          sx={{
            color: "onSurface",
            fontSize: 13,
            fontWeight: 400,
            lineHeight: "21px",
          }}
        >
          {activeDescription?.description}
        </Typography>
      </Box>
      <Slider
        disabled={!param.is_editable || isGenerating}
        sx={{
          height: "2px",
          width: "30%",
          minWidth: "300px",
          flexShrink: 0,
          color: "#375CA9",
          "& .MuiSlider-thumb": {
            height: 12,
            width: 12,
            boxShadow:
              "0px 1px 5px rgba(0, 0, 0, 0.12), 0px 2px 2px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.2)",
            position: "relative",
            "&::after": {
              content: "''",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 16,
              height: 16,
              bgcolor: "#375CA9",
              zIndex: -1,
            },
          },
          "& .MuiSlider-rail": {
            bgcolor: "#375CA9",
          },
          "& .MuiSlider-track": {
            height: "1px",
          },
        }}
        value={activeDescription?.score || 0}
        marks={marks}
        step={1}
        min={Math.min(...values)}
        max={Math.max(...values)}
        onChange={(e: any) => handleScoreChange(e.target.value as number)}
      />
    </Stack>
  );
};
