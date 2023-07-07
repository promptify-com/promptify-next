import React, { useEffect, useState } from "react";
import { Box, Slider, Typography } from "@mui/material";
import { PromptDescription } from "@/core/api/dto/prompts";

interface PromptParamsDescriptionProps {
  descriptions: PromptDescription[];
  activeScore: number;
  setScore: (score: number) => void;
  is_editable: boolean;
}

export const GeneratorParamSlider: React.FC<PromptParamsDescriptionProps> = ({
  descriptions,
  activeScore,
  setScore,
  is_editable,
}) => {
  const [activeMark, setActiveMark] = useState<number>(activeScore);
  const activeDescription = descriptions.find(
    (description) => description.score === activeMark
  );
  const [displayTitle, setDisplayTitle] = useState("");
  const [displayDesc, setDisplayDesc] = useState("");

  const marks = descriptions.map((description) => ({
    value: description.score,
  }));
  const values = marks.map((obj) => obj.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  useEffect(() => {
    if (activeDescription) {
      const description = activeDescription.description;
      const colon = description.indexOf(":");
      if (colon !== -1) {
        setDisplayTitle(description.slice(0, colon + 1));
        setDisplayDesc(description.slice(colon + 1));
      } else {
        setDisplayDesc(description);
      }
    }
  }, [activeDescription]);

  const handleSetMark = (mark: number) => {
    setActiveMark(mark);
    setScore(mark);
  };

  return (
    <Box>
      <Typography component={"span"}
        sx={{
          color: "onSurface",
          fontSize: 13,
          fontWeight: 500,
          maxWidth: "380px",
          lineHeight: "21px",
          mb: "10px",
        }}
      >
        {displayTitle}
      </Typography>
      <Typography component={"span"}
        sx={{
          color: "onSurface",
          fontSize: 13,
          fontWeight: 400,
          maxWidth: "380px",
          lineHeight: "21px",
          mb: "10px",
        }}
      >
        {displayDesc}
      </Typography>
      <Slider
        disabled={!is_editable}
        sx={{
          height: "2px",
          flexShrink: 0,
          color: "tertiary",
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
              bgcolor: "tertiary",
              zIndex: -1,
            },
          },
          "& .MuiSlider-rail": {
            bgcolor: "tertiary",
          },
          "& .MuiSlider-track": {
            height: "1px",
          },
        }}
        value={activeDescription?.score || 0}
        marks={marks}
        step={1}
        min={minValue}
        max={maxValue}
        onChange={(e: any) => handleSetMark(e.target.value as number)}
      />
    </Box>
  );
};
