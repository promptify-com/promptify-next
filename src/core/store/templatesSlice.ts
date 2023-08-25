import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface TemplatesProps {
  is_favorite: boolean;
  id: number;
  likes: number;
}

const initialState: TemplatesProps = {
  is_favorite: false,
  id: 0,
  likes: 0,
};

export const templatesSlice = createSlice({
  name: "templates",
  initialState,
  reducers: {
    updateCurrentFavorite: (state, action: PayloadAction<boolean>) => {
      state.is_favorite = action.payload;
      state.likes = action.payload ? state.likes + 1 : state.likes - 1;
    },
    updateTemplateData: (state, action: PayloadAction<TemplatesProps>) => {
      state.is_favorite = action.payload.is_favorite;
      state.id = action.payload.id;
      state.likes = action.payload.likes;
    },
  },
});

export const { updateCurrentFavorite, updateTemplateData } = templatesSlice.actions;

export default templatesSlice.reducer;
