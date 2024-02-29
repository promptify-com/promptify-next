import React from "react";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";

interface Props {
  size?: "small" | "medium";
}

export const ProgressLogo: React.FC<Props> = ({ size = "small" }) => {
  const isSmall = size === "small";

  return (
    <Stack
      sx={{
        bgcolor: "surface.1",
        p: "8px",
      }}
    >
      <CircularProgress
        size={isSmall ? 18 : 52}
        sx={{
          color: "grey.400",
          ".MuiCircularProgress-svg": {
            borderRadius: "50%",
            strokeWidth: 8,
          },
        }}
      />
    </Stack>
  );
};
