import React from "react";
import ArrowBackIosNew from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import { alpha } from "@mui/material";
import { theme } from "@/theme";

interface Props {
  scrollPrev(): void;
  scrollNext(): void;
  canScrollNext: boolean;
  canScrollPrev: boolean;
  children?: React.ReactNode;
}

export const CarouselButtons: React.FC<Props> = ({
  scrollPrev,
  scrollNext,
  canScrollNext,
  canScrollPrev,
  children,
}) => {
  return (
    <Stack
      direction={"row"}
      sx={{
        ".nav-btn": {
          opacity: children ? 0 : 1,
        },
        ":hover": {
          ".nav-btn": {
            opacity: 1,
          },
        },
      }}
    >
      <IconButton
        disabled={!canScrollPrev}
        onClick={scrollPrev}
        className="nav-btn"
        sx={{
          ...btnStyle,
          left: 0,
        }}
      >
        <ArrowBackIosNew />
      </IconButton>
      {children}
      <IconButton
        disabled={!canScrollNext}
        onClick={scrollNext}
        className="nav-btn"
        sx={{
          ...btnStyle,
          right: 0,
        }}
      >
        <ArrowForwardIos />
      </IconButton>
    </Stack>
  );
};

const btnStyle = {
  position: "absolute",
  zIndex: 999,
  height: "100%",
  border: "none",
  borderRadius: 0,
  color: "#1C1B1F80",
  bgcolor: alpha(theme.palette.surfaceContainerLowest, 0.9),
  p: "8px 16px",
  ":hover": {
    bgcolor: "surfaceContainerLowest",
  },
  "&.Mui-disabled": {
    opacity: 0.6,
  },
};

export default CarouselButtons;
