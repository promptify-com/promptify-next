import { IWorkflow } from "@/common/types/workflow";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IntialState {
  selectedWorkflow: IWorkflow;
}

const initialState: IntialState = {
  selectedWorkflow: {} as IWorkflow,
};

const workflowSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setSelectedWorkflow: (state, action: PayloadAction<IWorkflow>) => {
      state.selectedWorkflow = action.payload;
    },
  },
});

export const { setSelectedWorkflow } = workflowSlice.actions;

export default workflowSlice.reducer;
