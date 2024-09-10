"use client";
import React from "react";
// Materiel ui
import { AppBar, Toolbar, Box, Stack, Typography } from "@mui/material";
// Redux
import { useDispatch, useSelector } from "react-redux";
// import { toggle } from "@reducers/layout/sidebar";
// Components
import Logo from "@components/layouts/navbar/logo";
import Search from "@components/layouts/navbar/search";
import Profile from "@components/layouts/navbar/profile";

export default function Navbar() {
  // Redux
  const dispatch = useDispatch();
  // const { rtl, open } = useSelector(({ layout }) => layout.sidebar);

  return (
    <AppBar
      sx={{
        background: theme => theme.palette.background.paper,
        borderBottomRightRadius: 8,
        borderBottomLeftRadius: 8,
        left: { lg: 90 },
        width: { lg: "calc(100% - 90px)" },
      }}
      elevation={0}
    >
      <Toolbar
        disableGutters
        sx={{ minHeight: 80, left: 0, px: 2 }}
      >
        <Stack
          direction="row"
          spacing={4}
          sx={{ flex: 1, alignItems: "center" }}
        >
          <Logo />
          <Search />
          <Box sx={{ flexGrow: 1 }} />
          <Profile />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
