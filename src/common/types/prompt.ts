export interface PromptLiveResponseData {
  message: string;
  prompt: number;
  created_at: Date;
  isLoading?: boolean;
  isCompleted?: boolean;
  isFailed?: boolean;
}

export interface PromptLiveResponse {
  id?: number;
  created_at: Date;
  data: PromptLiveResponseData[];
}
export type InputType = "text" | "choices" | "number" | "code";
export interface IPromptInput {
  name: string;
  fullName: string;
  type: InputType;
  required: boolean;
  defaultValue?: string | number | null;
  choices?: string[] | null;
  prompt?: number;
}

export type FormMode = "input" | "chat";

export type AnsweredInputType = {
  promptId: number;
  inputName: string;
  value: string | number;
  modifiedFrom: FormMode;
};

export interface DisplayPrompt {
  prompt: number;
  content: string;
  created_at: Date | string;
  errors?: string;
  isLoading?: boolean;
  isCompleted?: boolean;
  isFailed?: boolean;
}
