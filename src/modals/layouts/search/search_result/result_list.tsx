import React from "react";
// material
import { Stack, InputBase, Typography, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
// Redux
import { useAppSelector, useAppDispatch } from "@/_redux";
import { handleClose, setSearch } from "@reducers/layout/search";
import { theme } from "@/theme";
// Components

export default function SuggestionList() {
  // Redux Dispatch hooks
  const dispatch = useAppDispatch();
  // Get Dialog Redux Data
  const { search } = useAppSelector(({ layout }) => layout.search);

  return (
    <Stack
      spacing={1}
      sx={{ p: 2 }}
    >
      <Typography variant="caption">List of Result Items</Typography>
    </Stack>
  );
}
