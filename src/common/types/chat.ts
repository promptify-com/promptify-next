import { TemplatesExecutions } from "@/core/api/dto/templates";

export interface AnswerValidatorResponse {
  answer: string;
  feedback: string;
  approved: boolean;
}

export interface IMessage {
  id: number;
  text: string;
  createdAt: string;
  fromUser: boolean;
  type: "text" | "form" | "spark";
  choices?: string[] | null;
  fileExtensions?: string[];
  startOver?: boolean;
  noHeader?: boolean;
  spark?: TemplatesExecutions;
}

export interface IAnswer {
  inputName: string;
  required: boolean;
  question: string;
  answer: string | number | File;
  prompt: number;
}
