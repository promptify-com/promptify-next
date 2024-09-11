import React from "react";
// material
import { Stack, InputBase, Typography, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
// Redux
import { useAppSelector, useAppDispatch } from "@/_redux";
import { handleClose, setSearch } from "@reducers/layout/search";
import { theme } from "@/theme";
// Components

export default function SearchInput() {
  // Redux Dispatch hooks
  const dispatch = useAppDispatch();
  // Get Dialog Redux Data
  const { search } = useAppSelector(({ layout }) => layout.search);

  return (
    <Stack
      spacing={1}
      direction="row"
      sx={{ p: 2, alignItems: "center", justifyContent: "center" }}
    >
      <SearchIcon />
      <InputBase
        sx={{ flex: 1 }}
        placeholder="Search Google Maps"
      />
      <IconButton
        sx={{ background: theme => theme.palette.grey[100], borderRadius: 2 }}
        onClick={() => dispatch(handleClose())}
      >
        <Typography variant="caption">esc</Typography>
      </IconButton>
    </Stack>
  );
}
