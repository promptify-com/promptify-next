import SyncRounded from "@mui/icons-material/SyncRounded";
import Button from "@mui/material/Button";
import React from "react";

interface Props {
  onClick: () => void;
  text?: string;
}

function RunButton({ onClick, text = "Run GPT" }: Props) {
  return (
    <Button
      variant="contained"
      onClick={onClick}
      endIcon={<SyncRounded />}
      sx={{
        fontSize: 13,
        lineHeight: "120%",
        p: "13px 24px",
        bgcolor: "#6E45E9",
        borderRadius: "100px",
        ":hover": {
          border: "1px solid #6E45E9",
          bgcolor: "white",
          color: "#6E45E9",
        },
      }}
    >
      {text}
    </Button>
  );
}

export default RunButton;
