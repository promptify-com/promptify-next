import { PromptInputType } from "@/components/Prompt/Types";

export type InputType = "text" | "choices" | "number" | "integer" | "code" | "file" | "credentials";

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
  connectionOpened?: boolean;
  temp_title?: string;
}
export interface IPromptInput {
  name: string;
  fullName: string;
  type: InputType;
  required: boolean;
  defaultValue?: string | number | null;
  choices?: string[];
  fileExtensions?: string[];
  prompt?: number;
  question?: string;
}

export type FormMode = "input" | "chat";

export type AnsweredInputType = {
  promptId: number;
  inputName: string;
  value: PromptInputType;
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
