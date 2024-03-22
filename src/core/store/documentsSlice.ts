import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Engine, EngineOutput } from "@/core/api/dto/templates";

type StatusType = "draft" | "saved" | null;

interface IState {
  status: StatusType;
  contentTypes: EngineOutput[];
  engine: Engine | null;
}

const initialState: IState = {
  status: null,
  contentTypes: [],
  engine: null,
};

const documentsSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setDocumentsStatus: (state, action: PayloadAction<StatusType | null>) => {
      state.status = action.payload;
    },
    setDocumentsContentTypes: (state, action: PayloadAction<EngineOutput[]>) => {
      state.contentTypes = action.payload;
    },
    setDocumentsEngine: (state, action: PayloadAction<Engine | null>) => {
      state.engine = action.payload;
    },
  },
});

export const { setDocumentsStatus, setDocumentsContentTypes, setDocumentsEngine } = documentsSlice.actions;

export default documentsSlice.reducer;
