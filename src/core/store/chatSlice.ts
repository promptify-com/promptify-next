import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { IPromptInput } from "@/common/types/prompt";
import type { ChatMode, ChatOption, IAnswer, IMessage } from "@/components/Prompt/Types/chat";
import type { PromptParams, ResOverrides } from "@/core/api/dto/prompts";
import type { ICredentialInput } from "@/components/Automation/types";
import type { Templates } from "@/core/api/dto/templates";
import Storage from "@/common/storage";

export interface ExecutionsProps {
  answers: IAnswer[];
  inputs: IPromptInput[];
  params: PromptParams[];
  paramsValues: ResOverrides[];
  isSimulationStreaming: boolean;
  credentialsInput: ICredentialInput[];
  areCredentialsStored: boolean;
  tmpMessages?: IMessage[];
  MessageSenderValue: string;
  selectedTemplate?: Templates;
  selectedChatOption?: ChatOption;
  chatMode: ChatMode;
}

const initialState: ExecutionsProps = {
  answers: [],
  inputs: [],
  params: [],
  paramsValues: [],
  isSimulationStreaming: false,
  credentialsInput: [],
  areCredentialsStored: false,
  tmpMessages: [],
  MessageSenderValue: "",
  selectedTemplate: undefined,
  selectedChatOption: Storage.get("chatOption"),
  chatMode: "automation",
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
    setMessageSenderValue: (state, action: PayloadAction<string>) => {
      state.MessageSenderValue = action.payload;
    },
    setSelectedTemplate: (state, action: PayloadAction<Templates | undefined>) => {
      state.selectedTemplate = action.payload;
    },
    setSelectedChatOption: (state, action: PayloadAction<ChatOption | undefined>) => {
      state.selectedChatOption = action.payload;
    },
    setChatMode: (state, action: PayloadAction<ChatMode>) => {
      state.chatMode = action.payload;
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
  setMessageSenderValue,
  setSelectedTemplate,
  setSelectedChatOption,
  setChatMode,
} = chatSlice.actions;

export default chatSlice.reducer;
