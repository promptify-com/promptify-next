import { Backdrop, CircularProgress } from "@mui/material";
import React, { ReactNode } from "react";
import { useWindowSize } from "usehooks-ts";

interface LoadingOverlayProps {
  size?: number;
  showOnDesktop?: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  size = 40,
  showOnDesktop = false, // Default to false, only show on mobile by default
}) => {
  const { width: windowWidth } = useWindowSize();
  const IS_MOBILE = windowWidth < 900;

  return (
    <Backdrop
      sx={{ zIndex: 6666 }}
      open={IS_MOBILE || showOnDesktop}
    >
      <CircularProgress
        color="inherit"
        size={size}
      />
    </Backdrop>
  );
};

export default LoadingOverlay;
