"use client";
import React from "react";
// Materiel ui
import { Stack, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SearchModal from "@/modals/layouts/search";
// Components

export default function Search() {
  return (
    <>
      <Stack
        direction="row"
        sx={{
          backgroundColor: theme => theme.palette.background.default,
          borderRadius: 4,
          p: 2,
          height: 40,
          alignItems: "center",
          width: "100%",
          cursor: "pointer",
        }}
      >
        <SearchIcon
          fontSize="small"
          sx={{ color: "#000" }}
        />
        <Typography
          color="rgba(27, 27, 30, 0.5)"
          sx={{ fontSize: 13, fontWeight: 400 }}
        >
          Search prompt templates...
        </Typography>
      </Stack>
      <SearchModal />
    </>
  );
}
