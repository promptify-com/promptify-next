import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Templates } from "../api/dto/templates";

export interface TemplatesProps {
  is_favorite: boolean;
  id: number;
  likes: number;
  executionData: string;
  isGenerating: boolean;
  template: Templates | null;
}

type UpdateTemplateDataPayload = Pick<TemplatesProps, "is_favorite" | "id" | "likes">;

const initialState: TemplatesProps = {
  is_favorite: false,
  id: 0,
  likes: 0,
  template: null,
  executionData: "[]",
  isGenerating: false,
};

export const templatesSlice = createSlice({
  name: "templates",
  initialState,
  reducers: {
    updateTemplate: (state, action: PayloadAction<Templates>) => {
      state.template = action.payload;
    },
    updateCurrentFavorite: (state, action: PayloadAction<boolean>) => {
      state.is_favorite = action.payload;
      state.likes = action.payload ? state.likes + 1 : state.likes - 1;
    },
    updateTemplateData: (state, action: PayloadAction<UpdateTemplateDataPayload>) => {
      state.is_favorite = action.payload.is_favorite;
      state.id = action.payload.id;
      state.likes = action.payload.likes;
    },
    updateExecutionData: (state, action: PayloadAction<string>) => {
      state.executionData = action.payload;
    },

    setGeneratingStatus: (state, action: PayloadAction<boolean>) => {
      state.isGenerating = action.payload;
    },
  },
});

export const { updateCurrentFavorite, updateTemplate, updateTemplateData, updateExecutionData, setGeneratingStatus } =
  templatesSlice.actions;

export default templatesSlice.reducer;
