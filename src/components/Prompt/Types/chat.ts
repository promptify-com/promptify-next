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
  | "HeaderWithText"
  | "question"
  | "readyMessage"
  | "contextualParam";

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
