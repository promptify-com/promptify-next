import { TemplatesExecutions } from "@/core/api/dto/templates";
import { PromptInputType } from ".";
import { IParameters } from "@/common/types";

export interface VaryValidatorResponse {
  [question: string]: string | number;
}

export type MessageType =
  | "text"
  | "form"
  | "spark"
  | "html"
  | "credentials"
  | "suggestedTemplates"
  | "headerWithText"
  | "questionInput"
  | "questionParam"
  | "readyMessage";

export interface IMessage {
  id: number;
  text: string;
  createdAt: Date | string;
  fromUser: boolean;
  type: MessageType;
  spark?: TemplatesExecutions;
  choices?: string[] | null;
  fileExtensions?: string[];
  startOver?: boolean;
  noHeader?: boolean;
  isRequired?: boolean;
  isEditable?: boolean;
  questionIndex?: number;
  questionInputName?: string;
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

export type ChatOption = "QA" | "FORM";

export type ChatMode = "messages" | "automation";

export interface IQuestion {
  inputName: string;
  prompt?: number;
  question: string;
  required: boolean;
  type: "input" | "param";
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
  timestamp?: string;
  isEditable?: boolean;
  isRequired?: boolean;
  questionIndex?: number;
  questionInputName?: string;
}
