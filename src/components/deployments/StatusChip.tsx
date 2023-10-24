import { DeploymentStatus } from "@/common/types/deployments";
import { Chip, styled } from "@mui/material";

export const StatusChip = styled(Chip)(({ status }: { status: DeploymentStatus }) => {
  const getStatusStyles = () => {
    switch (status) {
      case "CREATED":
        return {
          backgroundColor: "#cffafe", // Light blue
          color: "#06b6d4",
        };
      case "DEPLOYING":
        return {
          backgroundColor: "#fef3c7", // Light orange
          color: "#f59e0b",
        };
      case "DONE":
        return {
          backgroundColor: "#d1fae5", // Light green
          color: "#10b981",
        };
      case "FAILED":
        return {
          backgroundColor: "#ffcdd2", // Light red
          color: "#ef4444",
        };
      case "STOPPED":
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
