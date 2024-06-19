import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Engine, EngineType } from "@/core/api/dto/templates";
import { IDocumentSliceState, DocumentFilterStatusType } from "./types";

export const initialState: IDocumentSliceState = {
  filter: {
    status: null,
    contentTypes: [],
    engine: null,
    template: null,
  },
  title: "",
  showPreviews: false,
  favorites: {},
};

const documentsSlice = createSlice({
  name: "documents",
  initialState,
  reducers: {
    setDocumentsStatus: (state, action: PayloadAction<DocumentFilterStatusType | null>) => {
      state.filter.status = action.payload;
    },
    setDocumentsContentTypes: (state, action: PayloadAction<EngineType[]>) => {
      state.filter.contentTypes = action.payload;
    },
    setDocumentsEngine: (state, action: PayloadAction<Engine | null>) => {
      state.filter.engine = action.payload;
    },
    setDocumentsTemplate: (state, action: PayloadAction<number | null>) => {
      state.filter.template = action.payload;
    },
    setDocumentTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    toggleShowPreviews: state => {
      state.showPreviews = !state.showPreviews;
    },
    setFavorites: (state, action: PayloadAction<Record<number, boolean>>) => {
      const executionId = Number(Object.keys(action.payload)[0]);
      state.favorites[executionId] = action.payload[executionId];
    },
  },
});

export const countSelectedFilters = (state: IDocumentSliceState["filter"]): number => {
  let count = 0;

  if (state.engine) count += 1;
  if (state.status) count += 1;
  if (state.template) count += 1;

  count += state.contentTypes.length;

  return count;
};

export const {
  setDocumentsStatus,
  setDocumentsContentTypes,
  setDocumentsEngine,
  setDocumentsTemplate,
  setDocumentTitle,
  toggleShowPreviews,
  setFavorites,
} = documentsSlice.actions;

export default documentsSlice.reducer;
