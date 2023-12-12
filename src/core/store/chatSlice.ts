import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { IPromptInput } from "@/common/types/prompt";
import type { IAnswer, IMessage } from "@/common/types/chat";
import type { PromptParams, ResOverrides } from "../api/dto/prompts";

export interface ExecutionsProps {
  messages: IMessage[];
  answers: IAnswer[];
  inputs: IPromptInput[];
  params: PromptParams[];
  paramsValues: ResOverrides[];
  isSimulationStreaming: boolean;
}

const initialState: ExecutionsProps = {
  answers: [],
  messages: [],
  inputs: [],
  params: [],
  paramsValues: [],
  isSimulationStreaming: false,
};

export const chatSlice = createSlice({
  name: "executions",
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<IMessage[]>) => {
      state.messages = action.payload;
    },
    setAnswers: (state, action: PayloadAction<IAnswer[]>) => {
      state.answers = action.payload;
    },
    setInputs: (state, action: PayloadAction<IPromptInput[]>) => {
      state.inputs = action.payload;
    },
    setParams: (state, action: PayloadAction<PromptParams[]>) => {
      state.params = action.payload;
    },
    setparamsValues: (state, action: PayloadAction<ResOverrides[]>) => {
      state.paramsValues = action.payload;
    },
    setIsSimulationStreaming: (state, action: PayloadAction<boolean>) => {
      state.isSimulationStreaming = action.payload;
    },
  },
});

export const { setMessages, setAnswers, setInputs, setParams, setparamsValues, setIsSimulationStreaming } =
  chatSlice.actions;

export default chatSlice.reducer;
