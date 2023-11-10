import { Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import React from "react";
import { LogoApp } from "@/assets/icons/LogoApp";
import { theme } from "@/theme";

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
        <Box
          sx={{
            position: "relative",
            bgcolor: "surface.1",
            p: "8px",
            borderRadius: "8px",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
            }}
          >
            <LogoApp
              color={theme.palette.primary.main}
              width={24}
            />
          </Box>
          <CircularProgress
            size={52}
            sx={{
              color: "primary.main",
              ".MuiCircularProgress-circle": {
                strokeWidth: 2,
              },
            }}
          />
        </Box>
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
