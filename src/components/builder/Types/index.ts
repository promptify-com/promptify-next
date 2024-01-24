import { PromptInputType } from "@/components/Prompt/Types";
import { ContextualOverrides } from "@/core/api/dto/prompts";

export interface IExecuteData {
  contextual_overrides: ContextualOverrides[];
  prompt_params: Record<string, PromptInputType | { value: string | number; required: boolean }>;
}

export interface IExecuteInput {
  [key: string]: PromptInputType;
}

export interface IExecuteParam {
  parameter: number;
  score: number;
}

export type InputValue = {
  name: string;
  value: PromptInputType;
};

export type ParamValue = {
  parameter: number;
  score: number;
};
