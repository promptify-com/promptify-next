import {
  Engine,
  Templates,
  EngineType,
  Category,
  Tag,
  TemplatesExecutions,
  PopupTemplateDocument,
  TempalteApiStatusState,
} from "@/core/api/dto/templates";
import type { IPromptInput } from "@/common/types/prompt";
import type { ChatMode, IAnswer, IMessage } from "@/components/Prompt/Types/chat";
import type { PromptParams, ResOverrides } from "@/core/api/dto/prompts";
import type { ICredentialInput, IWorkflow, IWorkflowCreateResponse } from "@/components/Automation/types";
import type { IChat, ChatOption } from "@/core/api/dto/chats";
import type { PromptLiveResponse } from "@/common/types/prompt";
import type { AnsweredInputType } from "@/common/types/prompt";
import type { Link } from "@/components/Prompt/Types";
import type { User } from "@/core/api/dto/user";

export interface IBuilderSliceState {
  engines: Engine[];
  template: Templates | null;
  isTemplateOwner: boolean;
}

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
  selectedWorkflow?: IWorkflow;
  chatMode: ChatMode;
  initialChat: boolean;
  parameterSelected: string | null;
  currentExecutionDetails: { id: number | null; isFavorite: boolean };
  chats: IChat[];
  clonedWorkflow?: IWorkflowCreateResponse;
  choiceSelected?: string;
}

export type DocumentFilterStatusType = "draft" | "saved" | null;

export interface IDocumentSliceState {
  filter: {
    status: DocumentFilterStatusType;
    contentTypes: EngineType[];
    engine: Engine | null;
    template: number | null;
  };
  title: string;
  showPreviews: boolean;
}

export interface IExecutionsSliceState {
  selectedExecution: TemplatesExecutions | null;
  generatedExecution: PromptLiveResponse | null;
  repeatedExecution: TemplatesExecutions | null;
  sparkHashQueryParam: string | null;
  isFetching: boolean;
}

export interface IFilterSliceState {
  title: string | null;
  engine: Engine | null;
  engineType: EngineType[];
  tag: Tag[];
  category?: Category | null;
  subCategory?: Category | null;
  isFavorite?: boolean;
}

export interface ISidebarSliceState {
  builderSidebarOpen: boolean;
  isPromptsFiltersSticky: boolean;
  isChatHistorySticky: boolean;
  isDocumentsFiltersSticky: boolean;
  isPromptsReviewFiltersSticky: boolean;
  isLearnSidebarSticky: boolean;
}

export interface ITemplateSliceState {
  is_favorite: boolean;
  is_liked: boolean;
  id: number;
  likes: number;
  isGenerating: boolean;
  answeredInputs: AnsweredInputType[];
  activeSideBarLink: Link | null;
  showPromptsView: boolean;
  templateApiStatus: TempalteApiStatusState;
  popupTemplateDocument: PopupTemplateDocument;
}

export interface IToastSliceState {
  open: boolean;
  message: string;
  severity: "error" | "warning" | "info" | "success";
  duration?: number;
  position?: {
    vertical: "top" | "bottom";
    horizontal: "left" | "center" | "right";
  };
}

export interface IUserSliceState {
  currentUser: User | null;
}
