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

export interface IPromptInput {
  name: string;
  fullName: string;
  type: string;
  required: boolean;
  defaultValue?: string | number | null;
  choices?: string[] | null;
}
