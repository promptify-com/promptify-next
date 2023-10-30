import { DeploymentStatus } from "@/common/types/deployments";
import { Chip, Stack } from "@mui/material";
import React from "react";

interface ActiveFiltersProps {
  status: DeploymentStatus | string;
  searchName: string;
  onClearStatus: () => void;
  onClearSearch: () => void;
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({ status, onClearStatus, searchName, onClearSearch }) => {
  return (
    <Stack
      direction={"row"}
      gap={"8px"}
      alignItems={"center"}
    >
      {status !== "" && (
        <Chip
          label={status}
          onDelete={onClearStatus}
          sx={{
            bgcolor: { xs: "surface.5", md: "surface.1" },
            fontWeight: 400,
            fontSize: 13,
            lineHeight: "18px",
            letterSpacing: "0.16px",
          }}
        />
      )}

      {searchName !== "" && (
        <Chip
          label={searchName}
          onDelete={onClearSearch}
          sx={{
            bgcolor: { xs: "surface.5", md: "surface.1" },
            fontWeight: 400,
            fontSize: 13,
            lineHeight: "18px",
            letterSpacing: "0.16px",
          }}
        />
      )}
    </Stack>
  );
};

export default ActiveFilters;
