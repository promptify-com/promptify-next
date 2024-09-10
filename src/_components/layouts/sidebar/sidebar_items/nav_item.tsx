"use client";
import React, { useState } from "react";
// Materiel ui
import { IconButton, Stack, Typography } from "@mui/material";

export default function ServiceItem({ item }: Props) {
  //
  const Icon = item.Icon;
  // Match Route
  const [hover, setHover] = useState(false);
  const selected = false;
  // Route

  return (
    <IconButton
      onMouseEnter={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
      // onClick={() => navigate(to)}
    >
      <Stack
        sx={{ alignItems: "center", justifyContent: "center" }}
        spacing={1}
      >
        <Stack
          sx={{
            borderRadius: 2,
            width: 42,
            height: 42,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: selected || hover ? "rgb(253, 251, 255)" : undefined,
          }}
        >
          <Icon
            sx={{ width: hover ? 30 : 26, height: hover ? 30 : 26, color: selected || hover ? "#375CA9" : "#67677c" }}
          />
        </Stack>
        <Typography
          sx={{ fontSize: 12, fontWeight: 500, alignSelf: "center" }}
          color={"onSurface"}
        >
          {item.name}
        </Typography>
      </Stack>
    </IconButton>
  );
}

// Types
interface Props {
  item: NavItemType;
}
export interface NavItemType {
  name: string;
  Icon: React.ElementType;
  // href: string;
  // active: boolean;
  // external: boolean;
  // reload: boolean;
  // sx?: SxProps;
}
