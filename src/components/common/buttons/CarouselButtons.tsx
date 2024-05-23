import React from "react";
import ArrowBackIosNew from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import { SxProps } from "@mui/material";
import { usePathname } from "next/navigation";

interface Props {
  scrollPrev(): void;
  scrollNext(): void;
  canScrollNext: boolean;
  canScrollPrev: boolean;
  children?: React.ReactNode;
  buttonStyle?: SxProps;
  containerStyle?: SxProps;
}

export const CarouselButtons: React.FC<Props> = ({
  scrollPrev,
  scrollNext,
  canScrollNext,
  canScrollPrev,
  children,
  buttonStyle,
  containerStyle,
}) => {
  const pathName = usePathname();
  const isGptsPage = pathName === "/GPTs";

  const btnStyle = {
    zIndex: 999,
    height: "40px",
    width: "40px",
    border: isGptsPage ? "1px solid rgba(0, 0, 0, 0.10)" : "none",
    borderRadius: "40px",
    color: "#1C1B1F80",
    p: "8px 16px",
    "&.Mui-disabled": {
      opacity: ".4 !important",
    },
    ...buttonStyle,
  };

  return (
    <Stack
      direction={"row"}
      sx={containerStyle}
      gap={"8px"}
    >
      <IconButton
        aria-label="previous"
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
        aria-label="next"
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

export default CarouselButtons;
