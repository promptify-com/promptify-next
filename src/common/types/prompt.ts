import { Prompts } from "@/core/api/dto/prompts";

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
  data: PromptLiveResponseData[] | undefined;
}
export type ChatMessageType = "text" | "choices" | "number" | "code";
export interface IPromptInput {
  name: string;
  fullName: string;
  type: ChatMessageType;
  required: boolean;
  defaultValue?: string | number | null;
  choices?: string[] | null;
  prompt?: number;
}

export interface IVariable {
  id: number | undefined;
  label: string;
}
export interface DisplayPrompt {
  prompt: number;
  content: string;
  created_at: Date | string;
  errors?: string;
  isLoading?: boolean;
  isCompleted?: boolean;
  isFailed?: boolean;
}
