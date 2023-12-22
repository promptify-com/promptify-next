import { OutputFormat } from "@/common/constants";
import { IParameters } from "@/common/types";
import { PromptInputType } from "@/components/Prompt/Types";

interface Engine {
  id: number;
  name: string;
  icon: string;
  output_type: "IMAGE" | "TEXT";
  input_type: "IMAGE" | "TEXT";
  provider: string;
}

export interface Prompts {
  id: number;
  order: number;
  title: string;
  content: string;
  template: number;
  engine: Engine;
  allow_input: boolean;
  created_at: Date;
  dependencies?: number[];
  is_visible: boolean;
  show_output: boolean;
  model_parameters: {
    temperature: number;
    maximumLength: number;
    topP: number;
    presencePenalty: number;
    frequencyPenalty: number;
  } | null;
  output_format: string;
  prompt_output_variable: string;
  execution_priority: number;
  parameters: PromptParams[];
}

export interface PromptParam {
  id: number;
  name: string;
  code: string;
  type: string;
  category: number;
  score_descriptions: PromptParamScoreDescription[];
}

export interface PromptParamScoreDescription {
  description: string;
  score: number;
}

export interface PromptDescription {
  score: number;
  description: string;
}

export interface PromptParams {
  descriptions: PromptDescription[];
  score: number;
  parameter: IParameters;
  is_visible: boolean;
  is_editable: boolean;
  prompt: number;
}

interface ContextualOverrides {
  parameter: number;
  score: number;
}

export interface ResPrompt {
  prompt: number;
  contextual_overrides: ContextualOverrides[];
  prompt_params: Record<string, PromptInputType | { value: string | number; required: boolean }>;
}

export interface ResInputs {
  id: number;
  inputs: {
    [key: string]: {
      value: PromptInputType;
      required: boolean;
    };
  };
}

export interface ResOverrides {
  id: number;
  contextual_overrides: ContextualOverrides[];
}

export interface QuestionAnswerParams {
  question: string;
  answer: string;
}
export interface VaryParams {
  prompt: string;
  variables: {
    [question: string]: PromptInputType;
  };
}

export interface TemplateDataParams {
  TemplateData: {
    id: number;
    execution_priority: number;
    order: number;
    title: string;
    content: string;
    parameters: string[];
  };
}

type PromptParamsGenerate = TemplateDataParams | QuestionAnswerParams | VaryParams;

export interface TemplateQuestionGeneratorData {
  prompt: number;
  contextual_overrides: ContextualOverrides[];
  prompt_params: PromptParamsGenerate;
  output_format?: OutputFormat;
}
