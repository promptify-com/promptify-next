import { Templates, TemplatesExecutions } from "@/core/api/dto/templates";

export interface VaryValidatorResponse {
  [question: string]: string | number;
}

export interface IMessage {
  id: number;
  text: string;
  createdAt: Date | string;
  type: "text" | "form" | "spark" | "templates";
  fromUser?: boolean;
  spark?: TemplatesExecutions;
  choices?: string[] | null;
  fileExtensions?: string[];
  startOver?: boolean;
  noHeader?: boolean;
  templates?: Templates[];
  templatesTitle?: string;
}

export interface IAnswer {
  inputName: string;
  required: boolean;
  question: string;
  answer: string | number | File;
  prompt: number;
  error?: boolean;
}

export type AccordionChatMode = "generated_execution" | "execution" | "input" | "repeat";
