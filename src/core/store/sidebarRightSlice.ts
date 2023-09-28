import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  open: false,
};

const sidebarRightSlice = createSlice({
  name: "sidebarRight",
  initialState,
  reducers: {
    setOpenSidebarRight: (state, action: PayloadAction<boolean>) => {
      state.open = action.payload;
    },
  },
});

export const { setOpenSidebarRight } = sidebarRightSlice.actions;

export default sidebarRightSlice.reducer;
