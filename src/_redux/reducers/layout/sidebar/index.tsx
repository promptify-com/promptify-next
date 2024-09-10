import { createSlice } from "@reduxjs/toolkit";

// Types
export interface ISidebarSliceState {
  open: boolean;
  sticky: boolean;
}

// initial state
export const initialState: ISidebarSliceState = {
  open: false,
  sticky: false,
};

export const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    toggle: state => {
      state.open = !state.open;
    },
  },
});

// Action creators are generated for each case reducer function
export const { toggle } = sidebarSlice.actions;

export default sidebarSlice.reducer;
