import React from "react";
// material
import { Stack, InputBase, Typography, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
// Redux
import { useAppSelector, useAppDispatch } from "@/_redux";
import { handleClose, setSearch } from "@reducers/layout/search";
import { theme } from "@/theme";
// Components
import SuggestionList from "./suggestion_list";
import ResultList from "./result_list";
import EmptyResult from "./empty_result";

export default function SearchResult() {
  // Redux Dispatch hooks
  const dispatch = useAppDispatch();
  // Get Dialog Redux Data
  const { search } = useAppSelector(({ layout }) => layout.search);

  if (search === "") return <SuggestionList />;
  if (search === "dsfsdf") return <ResultList />;
  else return <EmptyResult />;

  return (
    <Stack
      spacing={1}
      sx={{ p: 2 }}
    >
      <Typography variant="caption">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Enim, fugit.</Typography>
    </Stack>
  );
}
