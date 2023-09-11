interface Engine {
  id: number;
  name: string;
  icon: string;
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
}

export interface PromptParam {
  id: number;
  name: string;
  code: string;
  type: string;
  category: number;
}

export interface PromptDescription {
  score: number;
  description: string;
}

export interface PromptParams {
  descriptions: PromptDescription[];
  score: number;
  parameter: PromptParam;
  is_visible: boolean;
  is_editable: boolean;
}

interface ContextualOverrides {
  parameter: number;
  score: number;
}

export interface ResPrompt {
  prompt: number;
  contextual_overrides: ContextualOverrides[];
  prompt_params: Record<string, string | number | { value: string | number; required: boolean }>;
}

export interface ResInputs {
  id: number;
  inputs: {
    [key: string]: {
      value: string | number;
      required: boolean;
    };
  };
}

export interface ResOverrides {
  id: number;
  contextual_overrides: ContextualOverrides[];
}

export interface TemplateQuestionGeneratorData {
  prompt: number;
  contextual_overrides: ContextualOverrides[];
  prompt_params: {
    TemplateData: {
      id: number;
      title: string;
      description: string;
      prompts: {
        id: number;
        execution_priority: number;
        order: number;
        title: string;
        content: string;
        parameters: string[];
      };
    };
  };
}
