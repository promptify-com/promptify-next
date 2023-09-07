import React from "react";
import { Backdrop, CircularProgress } from "@mui/material";

import { determineIsMobile } from "@/common/helpers/determineIsMobile";

interface LoadingOverlayProps {
  size?: number;
  showOnDesktop?: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  size = 40,
  showOnDesktop = false, // Default to false, only show on mobile by default
}) => {
  const IS_MOBILE = determineIsMobile();
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
