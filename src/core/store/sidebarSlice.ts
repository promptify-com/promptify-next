import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  builderSidebarOpen: false,
  isPromptsFiltersSticky: false,
  isChatHistorySticky: false,
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    setOpenBuilderSidebar: (state, action: PayloadAction<boolean>) => {
      state.builderSidebarOpen = action.payload;
    },
    setStickyPromptsFilters: (state, action: PayloadAction<boolean>) => {
      state.isPromptsFiltersSticky = action.payload;
    },
    setStickyChatHistory: (state, action: PayloadAction<boolean>) => {
      state.isChatHistorySticky = action.payload;
    },
  },
});

export const { setOpenBuilderSidebar, setStickyPromptsFilters, setStickyChatHistory } = sidebarSlice.actions;

export default sidebarSlice.reducer;
