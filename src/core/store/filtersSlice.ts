import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Storage from "@/common/storage";
import type { SelectedFilters } from "@/core/api/dto/templates";

const initialState: SelectedFilters = {
  engine: null,
  tag: [],
  title: null,
  category: null,
  subCategory: null,
  engineType: [],
  isFavorite: false,
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {},
});

export default filterSlice.reducer;
