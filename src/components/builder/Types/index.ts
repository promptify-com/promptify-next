import { PromptInputType } from "@/components/Prompt/Types";
import { ContextualOverrides } from "@/core/api/dto/prompts";

export interface IExecuteData {
  contextual_overrides: ContextualOverrides[];
  prompt_params: Record<string, PromptInputType | { value: string | number; required: boolean }>;
}

export interface IExecuteInput {
  [key: string]: {
    value: PromptInputType;
    required: boolean;
  };
}
