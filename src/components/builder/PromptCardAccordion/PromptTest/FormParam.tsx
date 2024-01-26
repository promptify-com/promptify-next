import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import { ParamValue } from "@/components/builder/Types";
import { IPromptParams } from "@/common/types/builder";
import { useState } from "react";

interface GeneratorParamProps {
  param: IPromptParams;
  onChange: (value: ParamValue) => void;
}

export default function FormParam({ param, onChange }: GeneratorParamProps) {
  const [activeScore, setActiveScore] = useState<number>(param.score);

  const handleScoreChange = (score: number) => {
    setActiveScore(score);
    onChange({
      parameter: param.parameter_id,
      score,
    });
  };

  const descriptions = param.descriptions ?? [];
  const activeDescription = descriptions.find(description => description.score === activeScore);
  const marks = descriptions.map(desc => ({ value: desc.score }));
  const values = marks.map(obj => obj.value);

  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      flexWrap={"wrap"}
      p={"6px"}
      gap={1}
    >
      <Stack
        flex={1}
        direction={"row"}
        alignItems={"start"}
        gap={"8px"}
        width={{ xs: "100%", md: "auto" }}
        justifyContent={"space-between"}
      >
        <Box>
          <InputLabel
            sx={{
              fontSize: { xs: 12, md: 15 },
              fontWeight: 500,
              lineHeight: "21px",
              letterSpacing: "0.17px",
              color: "primary.main",
              overflow: "visible",
            }}
          >
            {param.name}:
          </InputLabel>
          <Typography
            component={"span"}
            sx={{
              color: "onSurface",
              fontSize: { xs: 12, md: 13 },
              fontWeight: 400,
              lineHeight: "18.85px",
            }}
          >
            {activeDescription?.description}
          </Typography>
        </Box>
      </Stack>

      <Slider
        disabled={!param.is_editable || false}
        sx={{
          ...sliderStyle,
        }}
        value={activeDescription?.score || 2}
        marks={marks}
        step={1}
        min={Math.min(...values)}
        max={Math.max(...values)}
        onChange={(_, value) => handleScoreChange(value as number)}
      />
    </Stack>
  );
}
const sliderStyle = {
  height: "2px",
  width: { xs: "70%", md: "30%" },
  minWidth: { md: "300px" },
  flexShrink: 0,
  color: "primary.main",
  "& .MuiSlider-thumb": {
    height: 12,
    width: 12,
    boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.12), 0px 2px 2px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.2)",
    position: "relative",
    "&::after": {
      content: "''",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 16,
      height: 16,
      bgcolor: "primary.main",
      zIndex: -1,
    },
  },
  "& .MuiSlider-rail": {
    bgcolor: "primary.main",
  },
  "& .MuiSlider-track": {
    height: "1px",
  },
};
