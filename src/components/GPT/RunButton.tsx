import SyncRounded from "@mui/icons-material/SyncRounded";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import React from "react";
import { BtnStyle } from "./Constants";

interface Props {
  onClick: () => void;
  text?: string;
  disabled?: boolean;
  loading?: boolean;
  showIcon?: boolean;
  inline?: boolean;
}

function RunButton({ onClick, text = "Run GPT", disabled, loading, showIcon, inline }: Props) {
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
        p: inline ? "8px 24px" : "13px 24px",
      }}
    >
      {loading ? "Generating..." : text}
    </Button>
  );
}

export default RunButton;
