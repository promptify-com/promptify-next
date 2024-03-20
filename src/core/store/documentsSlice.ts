import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type StatusType = "draft" | "saved" | null;

interface IState {
  status: StatusType;
}

const initialState: IState = {
  status: null,
};

const documentsSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setDocumentsStatus: (state, action: PayloadAction<StatusType | null>) => {
      state.status = action.payload;
    },
  },
});

export const { setDocumentsStatus } = documentsSlice.actions;

export default documentsSlice.reducer;
