import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Storage from "@/common/storage";

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
      const sticky = action.payload;
      state.isPromptsFiltersSticky = sticky;
      if (sticky) {
        Storage.set("isPromptsFiltersSticky", String(sticky));
      } else {
        Storage.remove("isPromptsFiltersSticky");
      }
    },
    setStickyChatHistory: (state, action: PayloadAction<boolean>) => {
      const sticky = action.payload;
      state.isChatHistorySticky = sticky;
      Storage.set("isChatHistorySticky", String(sticky));
    },
  },
});

export const { setOpenBuilderSidebar, setStickyPromptsFilters, setStickyChatHistory } = sidebarSlice.actions;

export default sidebarSlice.reducer;
