import { Box, Slider, Stack, Typography } from "@mui/material";

const getParamLabel = (name: string) => {
  switch (name) {
    case "temperature":
      return "Temperature";
    case "maximumLength":
      return "Maximum Length";
    case "topP":
      return "Top P";
    case "presencePenalty":
      return "Presence Penalty";
    case "frequencyPenalty":
      return "Frequency Penalty";
    default:
      return name;
  }
};

interface Props {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export const ParamSliderInline = ({ label, value, onChange }: Props) => {
  return (
    <Box p={"8px 24px"}>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        py={"8px"}
      >
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 500,
            color: "onSurface",
          }}
        >
          {getParamLabel(label)}
        </Typography>
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 400,
            color: "onSurface",
          }}
        >
          {value}
        </Typography>
      </Stack>
      <Slider
        sx={{ color: "onSurface" }}
        step={1}
        min={0}
        max={100}
        size="small"
        value={value}
        onChange={(e, val) => onChange(Number(val))}
      />
    </Box>
  );
};
