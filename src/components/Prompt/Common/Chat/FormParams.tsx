import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import IconButton from "@mui/material/IconButton";
import HelpOutline from "@mui/icons-material/HelpOutline";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import CustomTooltip from "@/components/Prompt/Common/CustomTooltip";
import { setParamsValues } from "@/core/store/chatSlice";
import useVariant from "@/components/Prompt/Hooks/useVariant";
import type { PromptParams, ResOverrides } from "@/core/api/dto/prompts";
import Storage from "@/common/storage";

interface GeneratorParamProps {
  param: PromptParams;
}

export default function FormParam({ param }: GeneratorParamProps) {
  const dispatch = useAppDispatch();
  const { isVariantB, isAutomationPage } = useVariant();

  const paramsValues = useAppSelector(state => state.chat.paramsValues);
  const isGenerating = useAppSelector(state => state.template.isGenerating);

  useEffect(() => {
    const paramsStored = Storage.get("paramsValue");

    if (!paramsStored || isAutomationPage) return;

    const isRelevantParam = paramsStored.some((paramStored: ResOverrides) => paramStored.id === param.prompt);

    if (isRelevantParam) {
      dispatch(setParamsValues(paramsStored));
      Storage.remove("paramsValue");
    }
  }, []);

  const paramValue = paramsValues.find(paramVal => paramVal.id === param.prompt);

  const handleScoreChange = (score: number) => {
    const paramId = param.parameter.id;
    const updatedParamsValues = paramsValues.map(paramValue => {
      if (paramValue.id !== param.prompt) {
        return paramValue;
      }

      return {
        id: paramValue.id,
        contextual_overrides: paramValue.contextual_overrides.map(ctx =>
          ctx.parameter === paramId ? { parameter: paramId, score } : ctx,
        ),
      };
    });

    dispatch(setParamsValues(updatedParamsValues));
  };

  const matchingContext = paramValue?.contextual_overrides.find(
    contextual_override => contextual_override?.parameter === param.parameter.id,
  );

  const activeScore = matchingContext?.score || param.score;
  const descriptions = param.parameter.score_descriptions;
  const activeDescription = descriptions.find(description => description.score === activeScore);
  const marks = descriptions.map(description => ({ value: description.score }));
  const values = marks.map(obj => obj.value);

  const HelpIcon = () => {
    return (
      <CustomTooltip title={"Parameter"}>
        <IconButton
          sx={{
            opacity: 0.3,
            border: "none",
          }}
        >
          <HelpOutline />
        </IconButton>
      </CustomTooltip>
    );
  };

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      alignItems={{ xs: "start", md: "center" }}
      flexWrap={"wrap"}
      gap={1}
      sx={{
        px: "16px",
        "&:hover": {
          bgcolor: "surface.1",
        },
      }}
    >
      <Stack
        flex={1}
        direction={"row"}
        alignItems={"start"}
        gap={"8px"}
        width={{ xs: "100%", md: "auto" }}
        justifyContent={"space-between"}
      >
        <Stack
          direction={{ md: "row" }}
          alignItems={{ md: "center" }}
          gap={"16px"}
        >
          <InputLabel
            sx={{
              fontSize: { xs: 12, md: 15 },
              fontWeight: 500,
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
        </Stack>
        <Stack
          sx={{
            display: { xs: "flex", md: "none" },
          }}
        >
          <HelpIcon />
        </Stack>
      </Stack>

      <Slider
        disabled={!param.is_editable || isGenerating}
        sx={{
          ...sliderStyle,
        }}
        value={activeDescription?.score || 2}
        marks={marks}
        step={1}
        min={Math.min(...values)}
        max={Math.max(...values)}
        onChange={(e: any) => handleScoreChange(e.target.value as number)}
      />

      {isVariantB && (
        <Stack
          sx={{
            display: { xs: "none", md: "flex" },
          }}
        >
          <HelpIcon />
        </Stack>
      )}
    </Stack>
  );
}
const sliderStyle = {
  height: "2px",
  width: { xs: "70%", md: "100px" },
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
