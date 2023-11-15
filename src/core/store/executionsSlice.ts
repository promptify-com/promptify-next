import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { TemplatesExecutions } from "../api/dto/templates";
import type { PromptLiveResponse } from "@/common/types/prompt";

export interface ExecutionsProps {
  selectedExecution: TemplatesExecutions | null;
  generatedExecution: PromptLiveResponse | null;
  sparkHashQueryParam: string | null;
  isFetching: boolean;
}

const initialState: ExecutionsProps = {
  selectedExecution: null,
  generatedExecution: null,
  sparkHashQueryParam: null,
  isFetching: false,
};

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
    setSparkHashQueryParam: (state, action: PayloadAction<string | null>) => {
      state.sparkHashQueryParam = action.payload;
    },
    setIsFetching: (state, action: PayloadAction<boolean>) => {
      state.isFetching = action.payload;
    },
  },
});

export const { setSelectedExecution, setGeneratedExecution, setSparkHashQueryParam, setIsFetching } =
  executionsSlice.actions;

export default executionsSlice.reducer;
