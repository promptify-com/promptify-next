import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { IPromptInput } from "@/common/types/prompt";
import type { IAnswer } from "@/components/Prompt/Types/chat";
import type { PromptParams, ResOverrides } from "@/core/api/dto/prompts";
import type { AuthCredentials } from "@/components/Automation/types";

export interface ExecutionsProps {
  answers: IAnswer[];
  inputs: IPromptInput[];
  params: PromptParams[];
  paramsValues: ResOverrides[];
  isSimulationStreaming: boolean;
  authCredentials: AuthCredentials[];
}

const initialState: ExecutionsProps = {
  answers: [],
  inputs: [],
  params: [],
  paramsValues: [],
  isSimulationStreaming: false,
  authCredentials: [],
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setAnswers: (state, action: PayloadAction<IAnswer[]>) => {
      state.answers = action.payload;
    },
    setInputs: (state, action: PayloadAction<IPromptInput[]>) => {
      state.inputs = action.payload;
    },
    setParams: (state, action: PayloadAction<PromptParams[]>) => {
      state.params = action.payload;
    },
    setParamsValues: (state, action: PayloadAction<ResOverrides[]>) => {
      state.paramsValues = action.payload;
    },
    setIsSimulationStreaming: (state, action: PayloadAction<boolean>) => {
      state.isSimulationStreaming = action.payload;
    },
    setAuthCredentials: (state, action: PayloadAction<AuthCredentials[]>) => {
      state.authCredentials = action.payload;
    },
    clearChatStates: _state => {
      return initialState;
    },
  },
});

export const {
  setAnswers,
  setInputs,
  setParams,
  setParamsValues,
  setIsSimulationStreaming,
  setAuthCredentials,
  clearChatStates,
} = chatSlice.actions;

export default chatSlice.reducer;
