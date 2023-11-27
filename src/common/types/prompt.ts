export type InputType = "text" | "choices" | "number" | "integer" | "code" | "file";

export type FileType = "pdf" | "docx" | "txt";

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
export interface IPromptInput {
  name: string;
  fullName: string;
  type: InputType;
  required: boolean;
  question?: string;
  defaultValue?: string | number | null;
  choices?: string[];
  fileExtensions?: string[];
  prompt?: number;
}

export type FormMode = "input" | "chat";

export type AnsweredInputType = {
  promptId: number;
  inputName: string;
  value: string | number | File;
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

export interface UploadFileResponse {
  data?: {
    file_url?: string;
  };
  error?: unknown;
}
