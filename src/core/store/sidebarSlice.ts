import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  defaultSidebarOpen: true,
  builderSidebarOpen: false,
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    setOpenDefaultSidebar: (state, action: PayloadAction<boolean>) => {
      state.defaultSidebarOpen = action.payload;
    },
    setOpenBuilderSidebar: (state, action: PayloadAction<boolean>) => {
      state.builderSidebarOpen = action.payload;
    },
  },
});

export const { setOpenDefaultSidebar, setOpenBuilderSidebar } = sidebarSlice.actions;

export default sidebarSlice.reducer;
