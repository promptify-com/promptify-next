"use client";
import React from "react";
// Materiel ui
// eslint-disable-next-line no-restricted-imports
import { Drawer, Stack } from "@mui/material";
// Redux
import { useDispatch, useSelector } from "react-redux";
import { toggle } from "@reducers/layout/sidebar";
// Components
import NavItems from "@components/layouts/sidebar/sidebar_items";
// import Company from "@components/layouts/sidebar/company";

export default function Sidebar() {
  // Store Data
  const dispatch = useDispatch();
  const open = true;
  const sticky = true;
  // const { open } = useSelector(({ layout }) => layout.sidebar);

  return (
    <Drawer
      anchor="left"
      open={open}
      PaperProps={{
        sx: {
          mexWidth: 400,
          backgroundColor: theme => theme.palette.background.default,
          border: "none",
        },
      }}
      // onClose={() => dispatch(toggle())}
      variant={"persistent"}
    >
      <Stack
        direction="row"
        sx={{ height: "100%", overflow: "auto" }}
      >
        <NavItems />
        {/* <Stack sx={{ flex: 1 }}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt, pariatur.</Stack> */}
      </Stack>
    </Drawer>
  );
}
