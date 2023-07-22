import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category, Engine, SelectedFilters, Tag } from "../api/dto/templates";

const initialState: SelectedFilters = {
  engine: null,
  tag: null,
  keyword: null,
  category: null,
  subCategory: null,
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSelectedEngine: (state, action: PayloadAction<Engine | null>) => {
      state.engine = action.payload;
    },
    setSelectedTag: (state, action: PayloadAction<Tag | null>) => {
      state.tag = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<Category | null>) => {
      state.category = action.payload;
    },
    setSelectedSubCategory: (state, action: PayloadAction<Category | null>) => {
      state.subCategory = action.payload;
    },
    setSelectedKeyword: (state, action: PayloadAction<string | null>) => {
      state.keyword = action.payload;
    },
  },
});

export const {
  setSelectedEngine,
  setSelectedTag,
  setSelectedKeyword,
  setSelectedCategory,
  setSelectedSubCategory,
} = filterSlice.actions;

export default filterSlice.reducer;
