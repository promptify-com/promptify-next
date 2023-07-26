export interface PromptLiveResponseData {
  message: string;
  prompt: number;
  created_at: Date;
  isLoading?: boolean;
  isCompleted?: boolean;
  isFailed?: boolean;
  error?: string;
}

export interface PromptLiveResponse {
  id?: number;
  created_at: Date;
  data: PromptLiveResponseData[] | undefined;
}
