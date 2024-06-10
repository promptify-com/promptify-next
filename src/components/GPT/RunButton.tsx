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
  noIcon?: boolean;
}

function RunButton({ onClick, text = "Run GPT", disabled, loading = false, noIcon }: Props) {
  return (
    <Button
      variant="contained"
      onClick={onClick}
      disabled={disabled || loading}
      {...(!noIcon && {
        endIcon: loading ? (
          <CircularProgress
            size={12}
            sx={{ color: "#6E45E9" }}
          />
        ) : (
          <SyncRounded />
        ),
      })}
      sx={{
        ...BtnStyle,
        p: "13px 24px",
      }}
    >
      {loading ? "Generating..." : text}
    </Button>
  );
}

export default RunButton;
