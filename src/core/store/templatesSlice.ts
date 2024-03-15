import { createSlice } from "@reduxjs/toolkit";
import type { AnsweredInputType } from "@/common/types/prompt";
import type { PopupTemplates, TempalteApiStatusState } from "@/core/api/dto/templates";
import type { Link } from "@/components/Prompt/Types";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface TemplatesProps {
  is_favorite: boolean;
  is_liked: boolean;
  id: number;
  favorites_count: number;
  executionData: string;
  isGenerating: boolean;
  answeredInputs: AnsweredInputType[];
  activeSideBarLink: Link | null;
  showPromptsView: boolean;
  templateApiStatus: TempalteApiStatusState;
  popupTemplate: PopupTemplates;
}

type UpdateTemplateDataPayload = Pick<TemplatesProps, "is_favorite" | "is_liked" | "id" | "favorites_count">;

const initialState: TemplatesProps = {
  is_favorite: false,
  is_liked: false,
  id: 0,
  favorites_count: 0,
  executionData: "[]",
  isGenerating: false,
  activeSideBarLink: null,
  answeredInputs: [],
  showPromptsView: false,
  templateApiStatus: {
    data: null,
    isLoading: true,
  },
  popupTemplate: {
    template: null,
  },
};

export const templatesSlice = createSlice({
  name: "templates",
  initialState,
  reducers: {
    updateTemplateData: (state, action: PayloadAction<UpdateTemplateDataPayload>) => {
      state.is_favorite = action.payload.is_favorite;
      state.is_liked = action.payload.is_liked;
      state.id = action.payload.id;
      state.favorites_count = action.payload.favorites_count;
    },
    updateCurrentFavorite: (state, action: PayloadAction<boolean>) => {
      state.is_favorite = action.payload;
    },
    updateCurrentLike: (state, action: PayloadAction<boolean>) => {
      state.is_liked = action.payload;
      state.favorites_count = action.payload ? state.favorites_count + 1 : state.favorites_count - 1;
    },
    updateExecutionData: (state, action: PayloadAction<string>) => {
      state.executionData = action.payload;
    },
    updatePopupTemplate: (state, action: PayloadAction<PopupTemplates>) => {
      state.popupTemplate = action.payload;
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
  updateCurrentLike,
  updateTemplateData,
  updateExecutionData,
  updatePopupTemplate,
  setGeneratingStatus,
  setActiveToolbarLink,
  setShowPromptsView,
  setTemplateApiStatus,
} = templatesSlice.actions;

export default templatesSlice.reducer;
