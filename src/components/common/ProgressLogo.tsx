import React from "react";
import { Box, CircularProgress, Stack } from "@mui/material";
import { LogoApp } from "@/assets/icons/LogoApp";
import { theme } from "@/theme";

interface Props {
  size?: "small" | "medium";
  color?: string;
}

export const ProgressLogo: React.FC<Props> = ({ size = "small", color }) => {
  const isSmall = size === "small";

  return (
    <Stack
      sx={{
        position: "relative",
        bgcolor: "surface.1",
        p: "8px",
        borderRadius: "8px",
      }}
    >
      <CircularProgress
        size={isSmall ? 18 : 52}
        sx={{
          color: "grey.400",
          borderRadius: "50%",
          ".MuiCircularProgress-circle": {
            borderRadius: "50%",
            strokeWidth: 8,
          },
        }}
      />
    </Stack>
  );
};
