import { InputType } from "./prompt";

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
export interface IEngineParams {
  temperature?: number;
  maximumLength?: number;
  topP?: number;
  presencePenalty?: number;
  frequencyPenalty?: number;
}
export interface IPromptOptions {
  model_parameters: IEngineParams | null;
  output_format: string;
  is_visible: boolean;
  show_output: boolean;
  prompt_output_variable: string;
}
export interface IEditPrompts extends IPromptOptions {
  id?: number;
  temp_id?: number;
  title: string;
  content: string;
  engine_id: number;
  dependencies: number[];
  parameters: IPromptParams[];
  order: number;
}

export interface HighlightWithinTextareaRef {
  editorContainer: HTMLDivElement;
}

export interface InputVariable {
  id?: number;
  label: string;
  type: InputType;
  required: boolean;
  choices?: string[] | null;
}

export interface Preset extends OutputVariable {}

export interface OutputVariable {
  id?: number;
  label: string;
}

export type PresetType = "output" | "input";

export interface IHandlePreset {
  type: PresetType | null;
  label: string;
  firstAppend?: boolean;
}
