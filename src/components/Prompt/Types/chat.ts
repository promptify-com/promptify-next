import { Templates, TemplatesExecutions } from "@/core/api/dto/templates";
import { PromptInputType } from ".";

export interface VaryValidatorResponse {
  [question: string]: string | number;
}

export type MessageType = "text" | "form" | "spark" | "templates";

export interface IMessage {
  id: number;
  text: string;
  createdAt: Date | string;
  fromUser: boolean;
  type: MessageType;
  spark?: TemplatesExecutions;
  templates?: Templates[];
  choices?: string[] | null;
  fileExtensions?: string[];
  startOver?: boolean;
  noHeader?: boolean;
  shouldStream?: boolean;
}

export interface IAnswer {
  inputName: string;
  required: boolean;
  question: string;
  answer: PromptInputType;
  prompt: number;
  error?: boolean;
}

export type AccordionChatMode = "generated_execution" | "execution" | "input" | "repeat";
