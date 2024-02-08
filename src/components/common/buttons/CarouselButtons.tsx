import React from "react";
import ArrowBackIosNew from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";

interface Props {
  scrollPrev(): void;
  scrollNext(): void;
}

export const CarouselButtons: React.FC<Props> = ({ scrollPrev, scrollNext }) => {
  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      gap={1}
    >
      <IconButton
        sx={btnStyle}
        onClick={scrollPrev}
      >
        <ArrowBackIosNew />
      </IconButton>
      <IconButton
        sx={btnStyle}
        onClick={scrollNext}
      >
        <ArrowForwardIos />
      </IconButton>
    </Stack>
  );
};

const btnStyle = { border: "none", color: "#67677C" };

export default CarouselButtons;
