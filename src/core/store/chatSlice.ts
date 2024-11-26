import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { IPromptInput, PromptLiveResponse } from "@/common/types/prompt";
import type { IAnswer, IMessage } from "@/components/Prompt/Types/chat";
import type { PromptParams, ResOverrides } from "@/core/api/dto/prompts";
import type { ICredentialInput } from "@/components/Automation/types";
import { IApp } from "@/components/Automation/app/hooks/types";

export type IGeneratingStatus = "pending" | "started" | "generated" | "streaming";
export interface ExecutionsProps {
  answers: IAnswer[];
  inputs: IPromptInput[];
  params: PromptParams[];
  paramsValues: ResOverrides[];
  isSimulationStreaming: boolean;
  credentialsInput: ICredentialInput[];
  areCredentialsStored: boolean;
  tmpMessages?: IMessage[];
  selectedApp?: IApp;
  runInstantly: boolean;
  generatedExecution: PromptLiveResponse | null;
  gptGenerationStatus: IGeneratingStatus;
  executionStatus: boolean;
}

export const initialState: ExecutionsProps = {
  answers: [],
  inputs: [],
  params: [],
  paramsValues: [],
  isSimulationStreaming: false,
  credentialsInput: [],
  areCredentialsStored: false,
  tmpMessages: [],
  selectedApp: undefined,
  runInstantly: false,
  generatedExecution: null,
  gptGenerationStatus: "pending",
  executionStatus: false,
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
    setCredentialsInput: (state, action: PayloadAction<ICredentialInput[]>) => {
      state.credentialsInput = action.payload;
    },
    clearChatStates: _state => {
      return initialState;
    },
    setAreCredentialsStored: (state, action: PayloadAction<boolean>) => {
      state.areCredentialsStored = action.payload;
    },
    setTmpMessages: (state, action: PayloadAction<IMessage[]>) => {
      state.tmpMessages = action.payload;
    },
    setSelectedApp: (state, action: PayloadAction<IApp>) => {
      state.selectedApp = action.payload;
    },
    setRunInstantly: (state, action: PayloadAction<boolean>) => {
      state.runInstantly = action.payload;
    },
    setGeneratedExecution: (state, action: PayloadAction<PromptLiveResponse | null>) => {
      state.generatedExecution = action.payload;
    },
    setGeneratingStatus: (state, action: PayloadAction<IGeneratingStatus>) => {
      state.gptGenerationStatus = action.payload;
    },
    setExecutionStatus: (state, action: PayloadAction<boolean>) => {
      state.executionStatus = action.payload;
    },
    resetStates: _state => {
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
  setCredentialsInput,
  clearChatStates,
  setAreCredentialsStored,
  setTmpMessages,
  setSelectedApp,
  setRunInstantly,
  setGeneratedExecution,
  setGeneratingStatus,
  setExecutionStatus,
  resetStates,
} = chatSlice.actions;

export default chatSlice.reducer;
