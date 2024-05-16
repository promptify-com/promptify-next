import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IProfileSliceState } from "./types";

const initialState: IProfileSliceState = {
  showEditMode: false,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    showProfileInEditMode: (state, action: PayloadAction<IProfileSliceState["showEditMode"]>) => {
      state.showEditMode = action.payload;
    },
  },
});

export const { showProfileInEditMode } = profileSlice.actions;

export default profileSlice.reducer;
