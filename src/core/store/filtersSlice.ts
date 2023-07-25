import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category, Engine, SelectedFilters, Tag } from "../api/dto/templates";

const initialState: SelectedFilters = {
  engine: null,
  tag: [],
  title: null,
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
      state.tag.push(action.payload); // This should work fine now
    },
    setSelectedCategory: (state, action: PayloadAction<Category | null>) => {
      state.category = action.payload;
    },
    setSelectedSubCategory: (state, action: PayloadAction<Category | null>) => {
      state.subCategory = action.payload;
    },
    setSelectedKeyword: (state, action: PayloadAction<string | null>) => {
      state.title = action.payload;
    },
    deleteSelectedTag: (state, action: PayloadAction<number>) => {
      state.tag = state.tag.filter((tag) => tag?.id !== action.payload);
    },
  },
});

export const {
  setSelectedEngine,
  setSelectedTag,
  setSelectedKeyword,
  setSelectedCategory,
  setSelectedSubCategory,
  deleteSelectedTag
} = filterSlice.actions;

export default filterSlice.reducer;
