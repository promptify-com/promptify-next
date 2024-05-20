import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Storage from "@/common/storage";
import type { Category, Engine, EngineType, SelectedFilters, Tag } from "@/core/api/dto/templates";

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
  reducers: {
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
      if (!state.tag.length) {
        Storage.remove("tagFilter");
        return;
      }
      Storage.set("tagFilter", JSON.stringify(state.tag));
    },
    setSelectedEngineType: (state, action: PayloadAction<EngineType | EngineType[]>) => {
      const selectedTypes = Array.isArray(action.payload) ? action.payload : [action.payload];
      const keepTypes = state.engineType.filter(type => !selectedTypes.some(sType => sType.id === type.id));
      state.engineType = keepTypes.concat(selectedTypes);

      if (!!state.engineType?.length) {
        Storage.set("engineTypeFilter", JSON.stringify(state.engineType));
      } else {
        Storage.remove("engineTypeFilter");
      }
    },

    deleteSelectedEngineType: (state, action: PayloadAction<EngineType>) => {
      state.engineType = state.engineType?.filter(_engine => _engine.id !== action.payload.id);
      if (!!!state.engineType?.length) {
        Storage.remove("engineTypeFilter");
        return;
      }
      Storage.set("engineTypeFilter", JSON.stringify(state.engineType));
    },

    setMyFavoritesChecked: (state, action: PayloadAction<boolean>) => {
      state.isFavorite = action.payload;
      if (!action.payload) {
        Storage.remove("myFavoritesChecked");
        return;
      }

      Storage.set("myFavoritesChecked", JSON.stringify(action.payload));
    },
    resetFilters: () => {
      Storage.remove("engineTypeFilter");
      Storage.remove("tagFilter");
      Storage.remove("myFavoritesChecked");
      Storage.remove("engineFilter");
      return initialState;
    },
  },
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

export const {
  setSelectedTag,
  setSelectedKeyword,
  setSelectedCategory,
  setSelectedSubCategory,
  deleteSelectedTag,
  setSelectedEngineType,
  deleteSelectedEngineType,
  setMyFavoritesChecked,
  resetFilters,
} = filterSlice.actions;

export default filterSlice.reducer;
