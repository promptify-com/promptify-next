import { DeploymentStatus } from "@/common/types/deployments";
import { Chip, styled } from "@mui/material";

export const StatusChip = styled(Chip)(({ status }: { status: DeploymentStatus }) => {
  const getStatusStyles = () => {
    switch (status) {
      case "created":
        return {
          backgroundColor: "#cffafe", // Light blue
          color: "#06b6d4",
        };
      case "deploying":
        return {
          backgroundColor: "#fef3c7", // Light orange
          color: "#f59e0b",
        };
      case "done":
        return {
          backgroundColor: "#d1fae5", // Light green
          color: "#10b981",
        };
      case "failed":
        return {
          backgroundColor: "#ffcdd2", // Light red
          color: "#ef4444",
        };
      case "stopped":
        return {
          backgroundColor: "#f5f5f5", // Light gray
          color: "#333",
        };
      default:
        return {};
    }
  };

  return {
    borderRadius: "6px",
    padding: "3px",
    fontSize: "11px",
    fontWeight: "500",
    ...getStatusStyles(),
  };
});
