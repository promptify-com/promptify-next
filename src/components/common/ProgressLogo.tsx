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
        p: isSmall ? "4px" : "8px",
        borderRadius: "8px",
      }}
    >
      <Stack
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
        }}
      >
        <LogoApp
          color={color || theme.palette.primary.main}
          width={isSmall ? 14 : 24}
        />
      </Stack>
      <CircularProgress
        size={isSmall ? 32 : 52}
        sx={{
          color: "primary.main",
          ".MuiCircularProgress-circle": {
            strokeWidth: isSmall ? 2 : 2.5,
          },
        }}
      />
    </Stack>
  );
};
