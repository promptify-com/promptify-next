export interface AnswerValidatorResponse {
  answer: string;
  feedback: string;
  approved: boolean;
}

export interface IMessage {
  text: string;
  createdAt: string;
  fromUser: boolean;
  type: "text" | "form";
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
}
