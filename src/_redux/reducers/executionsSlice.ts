import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { TemplatesExecutions } from "@/core/api/dto/templates";
import type { PromptLiveResponse } from "@/common/types/prompt";

// Types
export interface IExecutionsSliceState {
  selectedExecution: TemplatesExecutions | null;
  generatedExecution: PromptLiveResponse | null;
  repeatedExecution: TemplatesExecutions | null;
  sparkHashQueryParam: string | null;
  isFetching: boolean;
}
export const initialState: IExecutionsSliceState = {
  selectedExecution: null,
  generatedExecution: null,
  repeatedExecution: null,
  sparkHashQueryParam: null,
  isFetching: false,
};
//
export const executionsSlice = createSlice({
  name: "executions",
  initialState,
  reducers: {
    setSelectedExecution: (state, action: PayloadAction<TemplatesExecutions | null>) => {
      state.selectedExecution = action.payload;
    },
    setGeneratedExecution: (state, action: PayloadAction<PromptLiveResponse | null>) => {
      state.generatedExecution = action.payload;
    },
    setRepeatedExecution: (state, action: PayloadAction<TemplatesExecutions | null>) => {
      state.repeatedExecution = action.payload;
    },
    setSparkHashQueryParam: (state, action: PayloadAction<string | null>) => {
      state.sparkHashQueryParam = action.payload;
    },
    setIsFetching: (state, action: PayloadAction<boolean>) => {
      state.isFetching = action.payload;
    },
    clearExecutionsStates: _state => {
      return initialState;
    },
  },
});

export const {
  setSelectedExecution,
  setGeneratedExecution,
  setRepeatedExecution,
  setSparkHashQueryParam,
  setIsFetching,
  clearExecutionsStates,
} = executionsSlice.actions;
export default executionsSlice.reducer;
