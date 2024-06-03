import { Templates, TemplatesExecutions } from "@/core/api/dto/templates";
import { PromptInputType } from ".";
import { IParameters } from "@/common/types";
import { IWorkflow } from "@/components/Automation/types";
import { InputType } from "@/common/types/prompt";

export interface VaryValidatorResponse {
  [question: string]: string | number;
}

export type MessageType =
  | "text"
  | "form"
  | "spark"
  | "html"
  | "credentials"
  | "credsForm"
  | "templates_suggestion"
  | "workflows_suggestion"
  | "template"
  | "questionInput"
  | "questionParam"
  | "readyMessage"
  | "workflowExecution"
  | "schedule_frequency"
  | "schedule_time"
  | "schedule_providers"
  | "schedule_activation"
  | "schedule_update"
  | "schedule_activation_test"
  | "input"
  | InputType;

export interface IMessage {
  id: number;
  text: string;
  createdAt: Date | string;
  fromUser: boolean;
  type: MessageType;
  spark?: TemplatesExecutions;
  template?: Templates;
  isLatestExecution?: boolean;
  fileExtensions?: string[];
  startOver?: boolean;
  noHeader?: boolean;
  isHighlight?: boolean;
  isRequired?: boolean;
  isEditable?: boolean;
  questionIndex?: number;
  questionInputName?: string;
  executionId?: number;
  data?: Templates[] | IWorkflow[];
  choices?: string[];
}

export interface IAnswer {
  parameter?: IParameters;
  inputName: string;
  required: boolean;
  question: string;
  answer: PromptInputType;
  prompt: number;
  error?: boolean;
}

export type ChatMode = "messages" | "automation";

export interface IQuestion {
  inputName: string;
  prompt?: number;
  question: string;
  required: boolean;
  type: InputType | "input" | "param";
  defaultValue?: string | number | null;
  choices?: string[];
  fileExtensions?: string[];
  // New property to distinguish between inputs and params
}

export interface CreateMessageProps {
  type: MessageType;
  text: string;
  fromUser?: boolean;
  noHeader?: boolean;
  isHighlight?: boolean;
  timestamp?: string;
  isEditable?: boolean;
  isRequired?: boolean;
  questionIndex?: number;
  questionInputName?: string;
  executionId?: number;
  template?: Templates;
  isLatestExecution?: boolean;
  data?: Templates[] | IWorkflow[];
  choices?: string[];
}
