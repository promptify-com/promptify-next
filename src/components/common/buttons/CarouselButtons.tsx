import React from "react";
import ArrowBackIosNew from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";

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
      alignItems={"center"}
      sx={{
        ".nav-btn": {
          opacity: 0,
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
        sx={btnStyle}
      >
        <ArrowBackIosNew />
      </IconButton>
      {children}
      <IconButton
        disabled={!canScrollNext}
        onClick={scrollNext}
        className="nav-btn"
        sx={btnStyle}
      >
        <ArrowForwardIos />
      </IconButton>
    </Stack>
  );
};

const btnStyle = {
  border: "none",
  color: "#1C1B1F80",
  bgcolor: "transparent",
  p: "8px 16px",
  "&.Mui-disabled": {
    opacity: 0.6,
  },
};

export default CarouselButtons;
