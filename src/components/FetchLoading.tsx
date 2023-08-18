import { Box, CircularProgress } from "@mui/material";
import React from "react";

export const FetchLoading = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <CircularProgress />
    </Box>
  );
};
