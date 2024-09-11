import { createSlice, PayloadAction } from "@reduxjs/toolkit";
//
import type { IPromptInput } from "@/common/types/prompt";
import type { ChatMode, IAnswer, IMessage } from "@/components/Prompt/Types/chat";
import type { PromptParams, ResOverrides } from "@/core/api/dto/prompts";
import type { ICredentialInput, ITemplateWorkflow, IWorkflowCreateResponse } from "@/components/Automation/types";
import type { Templates } from "@/core/api/dto/templates";
import type { IChat, ChatOption } from "@/core/api/dto/chats";

// Types
export interface IChatSliceState {
  answers: IAnswer[];
  inputs: IPromptInput[];
  params: PromptParams[];
  paramsValues: ResOverrides[];
  isSimulationStreaming: boolean;
  credentialsInput: ICredentialInput[];
  areCredentialsStored: boolean;
  tmpMessages?: IMessage[];
  selectedTemplate?: Templates;
  selectedChatOption?: ChatOption | null;
  selectedChat?: IChat;
  selectedWorkflow?: ITemplateWorkflow;
  chatMode: ChatMode;
  initialChat: boolean;
  parameterSelected: string | null;
  currentExecutionDetails: { id: number | null; isFavorite: boolean };
  chats: IChat[];
  clonedWorkflow?: IWorkflowCreateResponse;
  choiceSelected?: string;
  gptGenerationStatus: "pending" | "started" | "generated" | "streaming";
}
//
export const initialState: IChatSliceState = {
  answers: [],
  inputs: [],
  params: [],
  paramsValues: [],
  isSimulationStreaming: false,
  credentialsInput: [],
  areCredentialsStored: false,
  tmpMessages: [],
  selectedTemplate: undefined,
  selectedChat: undefined,
  chatMode: "automation",
  initialChat: true,
  parameterSelected: null,
  currentExecutionDetails: { id: null, isFavorite: false },
  selectedChatOption: null,
  selectedWorkflow: undefined,
  chats: [],
  clonedWorkflow: undefined,
  gptGenerationStatus: "pending",
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
    setSelectedTemplate: (state, action: PayloadAction<Templates | undefined>) => {
      state.selectedTemplate = action.payload;
    },
    setSelectedWorkflow: (state, action: PayloadAction<ITemplateWorkflow | undefined>) => {
      state.selectedWorkflow = action.payload;
    },
    setSelectedChat: (state, action: PayloadAction<IChat | undefined>) => {
      state.selectedChat = action.payload;
    },
    setSelectedChatOption: (state, action: PayloadAction<ChatOption>) => {
      state.selectedChatOption = action.payload;
    },
    setChatMode: (state, action: PayloadAction<ChatMode>) => {
      state.chatMode = action.payload;
    },
    setInitialChat: (state, action: PayloadAction<boolean>) => {
      state.initialChat = action.payload;
    },
    updateParameterSelection: (state, action) => {
      state.parameterSelected = action.payload;
    },
    clearParameterSelection: state => {
      state.parameterSelected = null;
    },
    setCurrentExecutionDetails: (state, action) => {
      state.currentExecutionDetails = action.payload;
    },
    setChats: (state, action) => {
      state.chats = action.payload;
    },
    setClonedWorkflow: (state, action: PayloadAction<IWorkflowCreateResponse | undefined>) => {
      state.clonedWorkflow = action.payload;
    },
    setChoiceSelected: (state, action: PayloadAction<string | undefined>) => {
      state.choiceSelected = action.payload;
    },
    setGptGenerationStatus: (state, action: PayloadAction<IChatSliceState["gptGenerationStatus"]>) => {
      state.gptGenerationStatus = action.payload;
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
  setSelectedTemplate,
  setSelectedChat,
  setSelectedChatOption,
  setChatMode,
  setInitialChat,
  updateParameterSelection,
  clearParameterSelection,
  setCurrentExecutionDetails,
  setSelectedWorkflow,
  setChats,
  setClonedWorkflow,
  setChoiceSelected,
  setGptGenerationStatus,
} = chatSlice.actions;
export default chatSlice.reducer;
