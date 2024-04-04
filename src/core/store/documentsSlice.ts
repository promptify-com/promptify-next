import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Engine, EngineType } from "@/core/api/dto/templates";

type StatusType = "draft" | "saved" | null;

interface IState {
  filter: {
    status: StatusType;
    contentTypes: EngineType[];
    engine: Engine | null;
    template: number | null;
  };
}

const initialState: IState = {
  filter: {
    status: null,
    contentTypes: [],
    engine: null,
    template: null,
  },
};

const documentsSlice = createSlice({
  name: "documents",
  initialState,
  reducers: {
    setDocumentsStatus: (state, action: PayloadAction<StatusType | null>) => {
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
  },
});

export const { setDocumentsStatus, setDocumentsContentTypes, setDocumentsEngine, setDocumentsTemplate } =
  documentsSlice.actions;

export default documentsSlice.reducer;
