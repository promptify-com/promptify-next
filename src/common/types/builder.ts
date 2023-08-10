export interface IPromptParams {
  parameter_id: number;
  score: number;
  name?: string;
  is_visible: boolean;
  is_editable: boolean;
  descriptions?: {
    score: number;
    description: string;
  }[];
}

export interface IPromptOptions {
  model_parameters: {
    temperature?: number;
    maximumLength?: number;
    topP?: number;
    presencePenalty?: number;
    frequencyPenalty?: number;
  } | null;
  output_format: string;
  is_visible: boolean;
  show_output: boolean;
  prompt_output_variable: string;
}
export interface INodesData extends IPromptOptions {
  id?: number;
  temp_id?: number;
  title: string;
  content: string;
  engine_id: number;
  dependencies: number[];
  parameters: IPromptParams[];
  order: number;
}