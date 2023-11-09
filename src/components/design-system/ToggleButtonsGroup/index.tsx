import { Grid, ToggleButton } from "@mui/material";
import React from "react";

interface Props {
  items: string[];
  variant: "horizontal" | "vertical";
  onChange: (item: string) => void;
  value: string;
  disabled: boolean;
}

export const ToggleButtonsGroup = ({ items, onChange, variant, value, disabled }: Props) => {
  const containerStyle = {
    display: "flex",
    flexDirection: variant === "horizontal" ? "row" : "column",
  };
  return (
    <Grid
      sx={containerStyle}
      gap={"8px"}
      alignItems={"start"}
    >
      {items?.map((item, idx) => (
        <ToggleButton
          key={idx}
          disabled={disabled}
          value={item}
          onChange={() => onChange(item)}
          sx={{
            height: "22px",
            p: "4px 10px",
            fontSize: "13px",
            lineHeight: "22px",
            fontWeight: "500",
            textTransform: "capitalize",
            borderRadius: "100px",
            bgcolor: value === item ? "success.main" : "",
            color: value === item ? "white" : "onSurface",
            "&:hover": {
              bgcolor: value === item ? "success.main" : "surface.3",
            },
            ":disabled": {
              color: value === item ? "white" : "gray",
            },
          }}
        >
          {item}
        </ToggleButton>
      ))}
    </Grid>
  );
};
