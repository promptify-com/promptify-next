import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Engine, EngineType } from "@/core/api/dto/templates";

type StatusType = "draft" | "saved" | null;

interface IState {
  status: StatusType;
  contentTypes: EngineType[];
  engine: Engine | null;
  template: number | null;
}

const initialState: IState = {
  status: null,
  contentTypes: [],
  engine: null,
  template: null,
};

const documentsSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setDocumentsStatus: (state, action: PayloadAction<StatusType | null>) => {
      state.status = action.payload;
    },
    setDocumentsContentTypes: (state, action: PayloadAction<EngineType[]>) => {
      state.contentTypes = action.payload;
    },
    setDocumentsEngine: (state, action: PayloadAction<Engine | null>) => {
      state.engine = action.payload;
    },
    setDocumentsTemplate: (state, action: PayloadAction<number | null>) => {
      state.template = action.payload;
    },
  },
});

export const { setDocumentsStatus, setDocumentsContentTypes, setDocumentsEngine, setDocumentsTemplate } =
  documentsSlice.actions;

export default documentsSlice.reducer;
