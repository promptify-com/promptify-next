import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface TemplatesProps {
  is_favorite: boolean;
  id: number;
  likes: number;
  executionData: string;
}

const initialState: TemplatesProps = {
  is_favorite: false,
  id: 0,
  likes: 0,
  executionData: "[]",
};

export const templatesSlice = createSlice({
  name: "templates",
  initialState,
  reducers: {
    updateCurrentFavorite: (state, action: PayloadAction<boolean>) => {
      state.is_favorite = action.payload;
      state.likes = action.payload ? state.likes + 1 : state.likes - 1;
    },
    updateTemplateData: (state, action: PayloadAction<Omit<TemplatesProps, "executionData">>) => {
      state.is_favorite = action.payload.is_favorite;
      state.id = action.payload.id;
      state.likes = action.payload.likes;
    },
    updateExecutionData: (state, action: PayloadAction<string>) => {
      state.executionData = action.payload;
    },
  },
});

export const { updateCurrentFavorite, updateTemplateData, updateExecutionData } = templatesSlice.actions;

export default templatesSlice.reducer;
