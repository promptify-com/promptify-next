import React from "react";
// Theme
import { IconButton, Avatar } from "@mui/material";

export default function Profile() {
  return (
    <IconButton
      sx={{ borderRadius: 2, width: 50, height: 50 }}
      // onClick={handleClick}
    >
      <Avatar
        variant="circular"
        // src={data?.admin_current_user?.avatar?.url}
      />
    </IconButton>
  );
}
