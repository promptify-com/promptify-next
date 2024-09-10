"use client";
import React from "react";
// Materiel ui
import { Typography, Link } from "@mui/material";
// Components
import { LogoApp } from "@/assets/icons/LogoApp";

export default function Logo() {
  return (
    <Link
      href={"/"}
      sx={{
        display: "flex",
        padding: "0 10px",
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      <LogoApp width={23} />
      <Typography
        color="black"
        sx={{ fontSize: 19, fontWeight: 500, ml: 1 }}
      >
        Promptify
      </Typography>
    </Link>
  );
}
