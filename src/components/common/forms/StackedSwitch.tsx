import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import { useState } from "react";

interface Props {
  title: string;
  description: string;
  checked: boolean;
  onChange(checked: boolean): void;
}

export default function StackedSwitch({ title, description, checked, onChange }: Props) {
  const [isChecked, setIsChecked] = useState(checked);

  return (
    <Stack
      direction={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
      gap={5}
      sx={{
        width: "calc(100% - 48px)",
        p: "16px 24px",
        border: "1px solid",
        borderRadius: "16px",
        borderColor: "surfaceContainerHighest",
        overflow: "hidden",
      }}
    >
      <Stack gap={1}>
        <Typography
          fontSize={16}
          fontWeight={400}
          color={"onSurface"}
        >
          {title}
        </Typography>
        <Typography
          fontSize={14}
          fontWeight={400}
          color={"secondary.light"}
        >
          {description}
        </Typography>
      </Stack>
      <FormControlLabel
        control={
          <Switch
            checked={isChecked}
            onChange={(_, checked) => setIsChecked(checked)}
          />
        }
        label={isChecked ? "On" : "Off"}
        sx={{
          flexDirection: "row-reverse",
          gap: 2,
          m: 0,
          ".MuiFormControlLabel-label": {
            fontSize: 16,
            fontWeight: 400,
            color: "onSurface",
          },
        }}
      />
    </Stack>
  );
}
