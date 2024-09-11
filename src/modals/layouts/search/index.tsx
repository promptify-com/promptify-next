import React from "react";
// material
import { Stack, Dialog, Typography, IconButton, Divider } from "@mui/material";
// Redux
import { useAppSelector, useAppDispatch } from "@/_redux";
import { handleClose } from "@reducers/layout/search";
// Components
import SearchInput from "./searchInput";

export default function SearchModal() {
  // Redux Dispatch hooks
  const dispatch = useAppDispatch();
  // Get Dialog Redux Data
  const { search, open } = useAppSelector(({ layout }) => layout.search);

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={() => dispatch(handleClose())}
      PaperProps={{ sx: { borderRadius: 2 } }}
      sx={{ backdropFilter: "blur(5px)" }}
    >
      <SearchInput />
      <Divider />
      Lorem ipsum dolor sit amet.
    </Dialog>
  );
}
