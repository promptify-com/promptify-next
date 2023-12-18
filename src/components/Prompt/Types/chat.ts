import { TemplatesExecutions } from "@/core/api/dto/templates";

export interface VaryValidatorResponse {
  [question: string]: string | number;
}

export interface IMessage {
  id: number;
  text: string;
  createdAt: Date | string;
  fromUser: boolean;
  type: "text" | "form" | "spark";
  spark?: TemplatesExecutions;
  choices?: string[] | null;
  fileExtensions?: string[];
  startOver?: boolean;
  noHeader?: boolean;
}

export interface IAnswer {
  inputName: string;
  required: boolean;
  question: string;
  answer: string | number | File;
  prompt: number;
  error?: boolean;
}
