import { Link } from "@/common/types/TemplateToolbar";
import { AnsweredInputType } from "@/common/types/prompt";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface TemplatesProps {
  is_favorite: boolean;
  id: number;
  likes: number;
  executionData: string;
  isGenerating: boolean;
  isSidebarExpanded: boolean;
  answeredInputs: AnsweredInputType[];
  activeSideBarLink: Link | null;
}

type UpdateTemplateDataPayload = Pick<TemplatesProps, "is_favorite" | "id" | "likes">;

const initialState: TemplatesProps = {
  is_favorite: false,
  id: 0,
  likes: 0,
  executionData: "[]",
  isGenerating: false,
  isSidebarExpanded: false,
  activeSideBarLink: null,
  answeredInputs: [],
};

export const templatesSlice = createSlice({
  name: "templates",
  initialState,
  reducers: {
    updateTemplateData: (state, action: PayloadAction<UpdateTemplateDataPayload>) => {
      state.is_favorite = action.payload.is_favorite;
      state.id = action.payload.id;
      state.likes = action.payload.likes;
    },
    updateCurrentFavorite: (state, action: PayloadAction<boolean>) => {
      state.is_favorite = action.payload;
      state.likes = action.payload ? state.likes + 1 : state.likes - 1;
    },

    updateExecutionData: (state, action: PayloadAction<string>) => {
      state.executionData = action.payload;
    },

    setGeneratingStatus: (state, action: PayloadAction<boolean>) => {
      state.isGenerating = action.payload;
    },
    openToolbarDrawer: (state, action: PayloadAction<boolean>) => {
      state.isSidebarExpanded = action.payload;
    },

    setActiveToolbarLink: (state, action: PayloadAction<Link | null>) => {
      state.activeSideBarLink = action.payload;
    },
  },
});

export const {
  updateCurrentFavorite,
  updateTemplateData,
  updateExecutionData,
  setGeneratingStatus,
  openToolbarDrawer,
  setActiveToolbarLink,
} = templatesSlice.actions;

export default templatesSlice.reducer;
