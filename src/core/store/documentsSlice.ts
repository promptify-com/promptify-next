import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EngineOutput } from "@/core/api/dto/templates";

type StatusType = "draft" | "saved" | null;

interface IState {
  status: StatusType;
  contentType: EngineOutput | null;
}

const initialState: IState = {
  status: null,
  contentType: null,
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
  },
});

export const { setDocumentsStatus, setDocumentsContentType } = documentsSlice.actions;

export default documentsSlice.reducer;
