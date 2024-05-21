import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import LocalStorage from "@/common/Storage/LocalStorage";
import { ISidebarSliceState } from "./types";

const initialState: ISidebarSliceState = {
  builderSidebarOpen: false,
  isPromptsFiltersSticky: false,
  isChatHistorySticky: false,
  isDocumentsFiltersSticky: false,
  isPromptsReviewFiltersSticky: false,
  isLearnSidebarSticky: false,
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    setOpenBuilderSidebar: (state, action: PayloadAction<boolean>) => {
      state.builderSidebarOpen = action.payload;
    },
    setStickyPromptsFilters: (state, action: PayloadAction<boolean>) => {
      const sticky = action.payload;
      state.isPromptsFiltersSticky = sticky;
      if (sticky) {
        LocalStorage.set("isPromptsFiltersSticky", String(sticky));
      } else {
        LocalStorage.remove("isPromptsFiltersSticky");
      }
    },
    setStickyDocumentsFilters: (state, action: PayloadAction<boolean>) => {
      const sticky = action.payload;
      state.isDocumentsFiltersSticky = sticky;
      if (sticky) {
        LocalStorage.set("isDocumentsFiltersSticky", String(sticky));
      } else {
        LocalStorage.remove("isDocumentsFiltersSticky");
      }
    },
    setStickyChatHistory: (state, action: PayloadAction<boolean>) => {
      const sticky = action.payload;
      state.isChatHistorySticky = sticky;
      LocalStorage.set("isChatHistorySticky", String(sticky));
    },
    setStickyPromptsReviewFilters: (state, action: PayloadAction<boolean>) => {
      const sticky = action.payload;
      state.isPromptsReviewFiltersSticky = sticky;
      if (sticky) {
        LocalStorage.set("isPromptsReviewFiltersSticky", String(sticky));
      } else {
        LocalStorage.remove("isPromptsReviewFiltersSticky");
      }
    },
    setStickyLearnSidebar: (state, action: PayloadAction<boolean>) => {
      const sticky = action.payload;
      state.isLearnSidebarSticky = sticky;
      LocalStorage.set("isLearnSidebarSticky", String(sticky));
    },
  },
});

export const {
  setOpenBuilderSidebar,
  setStickyPromptsFilters,
  setStickyChatHistory,
  setStickyDocumentsFilters,
  setStickyPromptsReviewFilters,
  setStickyLearnSidebar,
} = sidebarSlice.actions;

export default sidebarSlice.reducer;
