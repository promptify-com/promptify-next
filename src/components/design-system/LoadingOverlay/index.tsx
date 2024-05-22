import { Backdrop, CircularProgress } from "@mui/material";

import useBrowser from "@/hooks/useBrowser";

interface LoadingOverlayProps {
  size?: number;
  showOnDesktop?: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  size = 40,
  showOnDesktop = false, // Default to false, only show on mobile by default
}) => {
  const { isMobile } = useBrowser();

  return (
    <Backdrop
      sx={{ zIndex: 6666 }}
      open={isMobile || showOnDesktop}
    >
      <CircularProgress
        color="inherit"
        size={size}
      />
    </Backdrop>
  );
};

export default LoadingOverlay;
