import React from "react";
import IconButton from "@mui/material/IconButton";
import { ClassicPreset } from "rete";

export function CustomSocket<T extends ClassicPreset.Socket>(props: { data: T }) {
  return (
    <IconButton
      title={props.data.name}
      sx={{
        p: 0,
        width: "12px",
        height: "12px",
        borderRadius: "50%",
        backgroundColor: "#E1E2EC",
        zIndex: 2,
      }}
    />
  );
}
