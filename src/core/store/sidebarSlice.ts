import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  builderSidebarOpen: false,
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    setOpenBuilderSidebar: (state, action: PayloadAction<boolean>) => {
      state.builderSidebarOpen = action.payload;
    },
  },
});

export const { setOpenBuilderSidebar } = sidebarSlice.actions;

export default sidebarSlice.reducer;
