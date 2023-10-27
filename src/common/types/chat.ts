import { InputType } from "./prompt";

export interface AnswerValidatorResponse {
  answer: string;
  feedback: string;
  approved: boolean;
}

export interface IMessage {
  text: string;
  createdAt: string;
  fromUser: boolean;
  type: InputType;
  choices?: string[] | null;
  startOver?: boolean;
}

export interface IAnswer {
  inputName: string;
  required: boolean;
  question: string;
  answer: string | number | File;
  prompt: number;
}
