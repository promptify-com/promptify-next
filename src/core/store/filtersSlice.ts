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

export const countSelectedFilters = (state: SelectedFilters): number => {
  let count = 0;

  if (state.engine) count += 1;
  if (state.category) count += 1;
  if (state.subCategory) count += 1;
  if (state.title) count += 1;
  if (state.isFavorite) count += 1;

  count += state.tag.length;
  count += state.engineType.length;

  return count;
};

export default filterSlice.reducer;
