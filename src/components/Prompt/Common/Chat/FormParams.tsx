import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Slider from "@mui/material/Slider";
import HelpOutline from "@mui/icons-material/HelpOutline";

import { useAppSelector } from "@/hooks/useStore";
import type { PromptParams, ResOverrides } from "@/core/api/dto/prompts";
import Tooltip from "@mui/material/Tooltip";
import { useState } from "react";

interface GeneratorParamProps {
  param: PromptParams;
  paramValue: ResOverrides | undefined;
  onChange: (value: number, param: PromptParams) => void;
}

export default function FormParam({ param, paramValue, onChange }: GeneratorParamProps) {
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

  const [openTooltip, setOpenTooltip] = useState(false);

  const commonPopperProps = {
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, -9],
        },
      },
    ],
  };

  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      flexWrap={"wrap"}
      p={"16px 6px"}
      gap={1}
      borderBottom={"1px solid #ECECF4"}
    >
      <Stack
        flex={1}
        direction={"row"}
        alignItems={"start"}
        gap={"8px"}
        width={{ xs: "100%", md: "auto" }}
        justifyContent={"space-between"}
      >
        <Box pl={"45px"}>
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
            {param.parameter.name}:
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
        <Tooltip
          arrow
          title={"Parameter"}
          open={openTooltip}
          onClose={() => setOpenTooltip(false)}
          onOpen={() => setOpenTooltip(true)}
          PopperProps={commonPopperProps}
        >
          <IconButton
            onClick={() => setOpenTooltip(!openTooltip)}
            sx={{
              opacity: 0.3,
              border: "none",
              display: { xs: "flex", md: "none" },
            }}
          >
            <HelpOutline />
          </IconButton>
        </Tooltip>
      </Stack>

      <Slider
        disabled={!param.is_editable || isGenerating}
        sx={{
          height: "2px",
          width: { xs: "70%", md: "30%" },
          minWidth: { md: "300px" },
          flexShrink: 0,
          ml: { xs: "45px", md: "0" },
          color: "primary.main",
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
        }}
        value={activeDescription?.score || 2}
        marks={marks}
        step={1}
        min={Math.min(...values)}
        max={Math.max(...values)}
        onChange={(e: any) => handleScoreChange(e.target.value as number)}
      />

      <Tooltip
        arrow
        title={"Parameter"}
        open={openTooltip}
        onClose={() => setOpenTooltip(false)}
        onOpen={() => setOpenTooltip(true)}
        PopperProps={commonPopperProps}
      >
        <IconButton
          onClick={() => setOpenTooltip(!openTooltip)}
          sx={{
            opacity: 0.3,
            border: "none",
            display: { xs: "none", md: "flex" },
          }}
        >
          <HelpOutline />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}
