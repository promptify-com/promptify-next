import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  open: false,

};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    setOpenSidebar: (state, action: PayloadAction<boolean>) => {
      state.open = action.payload;
    },
   
  },
});

export const {setOpenSidebar} = sidebarSlice.actions;

export default sidebarSlice.reducer;
