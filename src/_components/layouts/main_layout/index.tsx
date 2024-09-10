"use client";
import React, { ReactNode } from "react";
// Materiel ui
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
// Components
import Sidebar from "@components/layouts/sidebar";
import Navbar from "@components/layouts/navbar";
// import Navigation from "@components/layouts/sidebar/navigation";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme => theme.palette.background.default,
      }}
    >
      <Sidebar />
      <Navbar />
      <Stack
        direction="row"
        sx={{ flex: 1, p: 1, justifyContent: "center" }}
      >
        {children}
      </Stack>
    </Box>
  );
}
