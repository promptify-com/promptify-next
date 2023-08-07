import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  showEditMode: false,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    SwitchProfileMode: (state, action: PayloadAction<boolean>) => {
      state.showEditMode = action.payload;
    },
  },
});

export const { SwitchProfileMode } = profileSlice.actions;

export default profileSlice.reducer;
