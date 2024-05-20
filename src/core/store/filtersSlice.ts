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
  reducers: {
    setSelectedKeyword: (state, action: PayloadAction<string | null>) => {
      state.title = action.payload;
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

export const { setSelectedKeyword, setMyFavoritesChecked, resetFilters } = filterSlice.actions;

export default filterSlice.reducer;
