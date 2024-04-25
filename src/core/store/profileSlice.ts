import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  showEditMode: false,
};

const profileSlice = createSlice({
  name: "profile2",
  initialState,
  reducers: {
    showProfileInEditMode: (state, action: PayloadAction<boolean>) => {
      state.showEditMode = action.payload;
    },
  },
});

export const { showProfileInEditMode } = profileSlice.actions;

export default profileSlice.reducer;
