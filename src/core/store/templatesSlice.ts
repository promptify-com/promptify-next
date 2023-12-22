import { TempalteApiStatusState, TemplateApiStatus, TemplatesExecutions } from "./../api/dto/templates";
import { AnsweredInputType } from "@/common/types/prompt";
import { Link } from "@/components/Prompt/Types";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface TemplatesProps {
  is_favorite: boolean;
  id: number;
  likes: number;
  executionData: string;
  isGenerating: boolean;
  answeredInputs: AnsweredInputType[];
  activeSideBarLink: Link | null;
  showPromptsView: boolean;
  templateApiStatus: TempalteApiStatusState;
}

type UpdateTemplateDataPayload = Pick<TemplatesProps, "is_favorite" | "id" | "likes">;

const initialState: TemplatesProps = {
  is_favorite: false,
  id: 0,
  likes: 0,
  executionData: "[]",
  isGenerating: false,
  activeSideBarLink: null,
  answeredInputs: [],
  showPromptsView: false,
  templateApiStatus: {
    data: null,
    isLoading: true,
  },
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

    setActiveToolbarLink: (state, action: PayloadAction<Link | null>) => {
      state.activeSideBarLink = action.payload;
    },

    setShowPromptsView: (state, action: PayloadAction<boolean>) => {
      state.showPromptsView = action.payload;
    },
    setTemplateApiStatus: (state, action: PayloadAction<TempalteApiStatusState>) => {
      state.templateApiStatus = action.payload;
    },
  },
});

export const {
  updateCurrentFavorite,
  updateTemplateData,
  updateExecutionData,
  setGeneratingStatus,
  setActiveToolbarLink,
  setShowPromptsView,
  setTemplateApiStatus,
} = templatesSlice.actions;

export default templatesSlice.reducer;
