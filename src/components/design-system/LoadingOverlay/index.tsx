import { Backdrop, CircularProgress } from "@mui/material";
import React, { ReactNode } from "react";

interface LoadingOverlayProps {
  loading: boolean;
  children: ReactNode;
  size?: number;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ loading, children, size = 16 }) => {
  return (
    <Backdrop open={loading}>
      {loading ? (
        <CircularProgress
          color="inherit"
          sx={{ fontSize: size }}
        />
      ) : (
        <div>{children}</div>
      )}
    </Backdrop>
  );
};

export default LoadingOverlay;
