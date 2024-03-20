import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Engine, EngineOutput } from "@/core/api/dto/templates";

type StatusType = "draft" | "saved" | null;

interface IState {
  status: StatusType;
  contentType: EngineOutput | null;
  engine: Engine | null;
}

const initialState: IState = {
  status: null,
  contentType: null,
  engine: null,
};

const documentsSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setDocumentsStatus: (state, action: PayloadAction<StatusType | null>) => {
      state.status = action.payload;
    },
    setDocumentsContentType: (state, action: PayloadAction<EngineOutput | null>) => {
      state.contentType = action.payload;
    },
    setDocumentsEngine: (state, action: PayloadAction<Engine | null>) => {
      state.engine = action.payload;
    },
  },
});

export const { setDocumentsStatus, setDocumentsContentType, setDocumentsEngine } = documentsSlice.actions;

export default documentsSlice.reducer;
