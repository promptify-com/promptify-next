import React from "react";
import Chip from "@mui/material/Chip";
import { styled } from "@mui/material/styles";

type Status = "active" | "paused";

interface StatusStyles {
  [key: string]: {
    border: string;
    backgroundColor: string;
    color: string;
    iconColor: string;
  };
}

const statusStyles: StatusStyles = {
  active: {
    border: "1px solid rgba(119, 185, 78, 0.20)",
    backgroundColor: "#E5FFD5",
    color: "#3C8032",
    iconColor: "#77B94E",
  },
  paused: {
    border: "1px solid rgba(255, 165, 0, 0.20)",
    backgroundColor: "#FFE5D5",
    color: "#D95B00",
    iconColor: "#FF8C00",
  },
};

const StyledChip = styled(Chip, {
  shouldForwardProp: prop => prop !== "status",
})<{ status: Status }>(({ status }) => ({
  border: statusStyles[status].border,
  backgroundColor: statusStyles[status].backgroundColor,
  color: statusStyles[status].color,
  borderRadius: "16px",
  padding: "5px 5px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  maxHeight: "22px",
  "& .MuiChip-icon": {
    color: statusStyles[status].iconColor,
    width: "10px",
    height: "10px",
  },
  "& .MuiChip-label": {
    fontSize: "10px",
    color: "#000",
    fontWeight: 600,
    lineHeight: "120%",
  },
}));

interface StatusChipProps {
  status: Status;
}

function StatusChip({ status }: StatusChipProps) {
  return (
    <StyledChip
      icon={
        <span
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: statusStyles[status].iconColor,
            display: "inline-block",
          }}
        />
      }
      label={status.toUpperCase()}
      status={status}
    />
  );
}

export default StatusChip;
