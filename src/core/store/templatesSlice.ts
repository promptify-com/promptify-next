import { createSlice } from "@reduxjs/toolkit";
import type { PopupTemplateDocument, TempalteApiStatusState } from "@/core/api/dto/templates";
import type { Link } from "@/components/Prompt/Types";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ITemplateSliceState } from "./types";

type UpdateTemplateDataPayload = Pick<ITemplateSliceState, "is_favorite" | "is_liked" | "id" | "likes">;

export const initialState: ITemplateSliceState = {
  is_favorite: false,
  is_liked: false,
  id: 0,
  likes: 0,
  isGenerating: false,
  activeSideBarLink: null,
  answeredInputs: [],
  showPromptsView: false,
  templateApiStatus: {
    data: null,
    isLoading: true,
  },
  popupTemplateDocument: {
    data: null,
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
      state.likes = action.payload.likes;
    },
    updateCurrentFavorite: (state, action: PayloadAction<boolean>) => {
      state.is_favorite = action.payload;
    },
    updatePopupTemplate: (state, action: PayloadAction<PopupTemplateDocument>) => {
      state.popupTemplateDocument = action.payload;
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
  updatePopupTemplate,
  setGeneratingStatus,
  setActiveToolbarLink,
  setShowPromptsView,
  setTemplateApiStatus,
} = templatesSlice.actions;

export default templatesSlice.reducer;
