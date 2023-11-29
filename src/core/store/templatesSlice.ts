import { AnsweredInputType } from "@/common/types/prompt";
import { SidebarLink } from "@/common/types/template";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface TemplatesProps {
  is_favorite: boolean;
  id: number;
  likes: number;
  executionData: string;
  isGenerating: boolean;
  isChatFullScreen: boolean;
  answeredInputs: AnsweredInputType[];
  activeSideBarLink: SidebarLink | null;
}

type UpdateTemplateDataPayload = Pick<TemplatesProps, "is_favorite" | "id" | "likes">;

const initialState: TemplatesProps = {
  is_favorite: false,
  id: 0,
  likes: 0,
  executionData: "[]",
  isGenerating: false,
  isChatFullScreen: true,
  answeredInputs: [],
  activeSideBarLink: null,
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
    setChatFullScreenStatus: (state, action: PayloadAction<boolean>) => {
      state.isChatFullScreen = action.payload;
    },
    setActiveSidebarLink: (state, action: PayloadAction<SidebarLink | null>) => {
      state.activeSideBarLink = action.payload;
    },
  },
});

export const {
  updateCurrentFavorite,
  updateTemplateData,
  updateExecutionData,
  setGeneratingStatus,
  setChatFullScreenStatus,
  setActiveSidebarLink,
} = templatesSlice.actions;

export default templatesSlice.reducer;
