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
      gap={1}
    >
      <IconButton
        sx={{
          ...btnStyle,
          mr: children ? "-31px" : "0",
        }}
        disabled={!canScrollPrev}
        onClick={scrollPrev}
      >
        <ArrowBackIosNew />
      </IconButton>
      {children}
      <IconButton
        sx={{
          ...btnStyle,
          ml: children ? "-31px" : "0",
        }}
        disabled={!canScrollNext}
        onClick={scrollNext}
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
  "&.Mui-disabled": {
    opacity: 0.6,
  },
};

export default CarouselButtons;
