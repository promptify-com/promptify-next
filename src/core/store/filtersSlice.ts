import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category, Engine, SelectedFilters, Tag } from "../api/dto/templates";
import Storage from "@/common/storage";

const initialState: SelectedFilters = {
  engine: null,
  tag: [],
  title: null,
  category: null,
  subCategory: null,
  engineType: "",
  isFavourite: false,
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSelectedEngine: (state, action: PayloadAction<Engine | null>) => {
      state.engine = action.payload;
      if (action.payload) {
        Storage.set("engineFilter", JSON.stringify(action.payload));
      } else {
        Storage.remove("engineFilter");
      }
    },
    setSelectedTag: (state, action: PayloadAction<Tag>) => {
      if (state.tag?.find(_tag => _tag.id === action.payload?.id)) {
        return;
      }

      state.tag.push(action.payload);

      Storage.set("tagFilter", JSON.stringify(state.tag));
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
      state.tag = state.tag.filter(tag => tag?.id !== action.payload);
      if (state.tag.length === 0) Storage.remove("tagFilter");
      Storage.set("tagFilter", JSON.stringify(state.tag));
    },
    setSelectedEngineType: (state, action: PayloadAction<string>) => {
      state.engineType = action.payload;

      if (action.payload) {
        Storage.set("engineTypeFilter", JSON.stringify(action.payload));
      } else {
        Storage.remove("engineTypeFilter");
      }
    },
    setMyFavoritesChecked: (state, action: PayloadAction<boolean>) => {
      state.isFavourite = action.payload;
      Storage.set("myFavoritesChecked", JSON.stringify(action.payload));
      if (!action.payload) {
        Storage.remove("myFavoritesChecked");
      }
    },
  },
});

export const {
  setSelectedEngine,
  setSelectedTag,
  setSelectedKeyword,
  setSelectedCategory,
  setSelectedSubCategory,
  deleteSelectedTag,
  setSelectedEngineType,
  setMyFavoritesChecked,
} = filterSlice.actions;

export default filterSlice.reducer;
