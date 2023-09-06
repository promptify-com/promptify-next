import { Backdrop, CircularProgress } from "@mui/material";
import React, { ReactNode } from "react";
import { useWindowSize } from "usehooks-ts";

interface LoadingOverlayProps {
  loading: boolean;
  children: ReactNode;
  size?: number;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ loading, children, size = 16 }) => {
  const { width: windowWidth } = useWindowSize();
  const IS_MOBILE = windowWidth < 960;

  return (
    <Backdrop open={loading && IS_MOBILE}>
      {loading ? (
        <CircularProgress
          color="inherit"
          sx={{ fontSize: size }}
        />
      ) : (
        <>{children}</>
      )}
    </Backdrop>
  );
};

export default LoadingOverlay;
