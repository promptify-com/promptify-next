import SyncRounded from "@mui/icons-material/SyncRounded";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import React from "react";
import { BtnStyle } from "./Constants";
import type { SxProps } from "@mui/material/styles";

interface Props {
  onClick: () => void;
  text?: string;
  disabled?: boolean;
  loading?: boolean;
  showIcon?: boolean;
  sx?: SxProps;
}

function RunButton({ onClick, text = "Run AI App", disabled, loading, showIcon, sx = {} }: Props) {
  const icon = loading ? (
    <CircularProgress
      size={12}
      sx={{ color: "#6E45E9" }}
    />
  ) : showIcon ? (
    <SyncRounded />
  ) : null;

  return (
    <Button
      variant="contained"
      onClick={onClick}
      disabled={disabled || loading}
      endIcon={icon}
      sx={{
        ...BtnStyle,
        p: "13px 24px",
        ...sx,
      }}
    >
      {loading ? "Generating..." : text}
    </Button>
  );
}

export default RunButton;
