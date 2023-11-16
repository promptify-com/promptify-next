import { Button, Stack, Typography } from "@mui/material";
import React from "react";
import { ProgressLogo } from "../ProgressLogo";

type CardProps = {
  onCancel: () => void;
};

export const GeneratingProgressCard: React.FC<CardProps> = ({ onCancel }) => {
  return (
    <Stack
      gap={1}
      sx={{
        p: "8px",
        borderRadius: "16px",
        bgcolor: "surface.3",
        width: "100%",
      }}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        gap={2}
      >
        <ProgressLogo />
        <Stack gap={0.5}>
          <Typography
            fontSize={12}
            fontWeight={500}
            color={"onSurface"}
          >
            Generating in progress...
          </Typography>
          <Typography
            fontSize={10}
            fontWeight={400}
            color={"onSurface"}
            sx={{ opacity: 0.5 }}
          >
            Estimated time: 360s
          </Typography>
        </Stack>
      </Stack>
      <Button
        variant="text"
        sx={{
          p: "4px 10px",
          borderRadius: "40px",
          fontSize: 13,
          fontWeight: 500,
          bgcolor: "surface.1",
          color: "onSurface",
          ":hover": {
            bgcolor: "action.hover",
          },
        }}
        onClick={onCancel}
      >
        Cancel
      </Button>
    </Stack>
  );
};
