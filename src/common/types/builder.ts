import type { ReactNode } from "react";
import type { InputType } from "./prompt";

interface ScoreDescription {
  score: number;
  description: string;
}

export interface Parameter {
  category: number;
  code: string;
  id: number;
  name: string;
  score_descriptions: ScoreDescription[];
  type: string;
}

export interface IPromptParams {
  parameter_id: number;
  parameter?: Parameter;
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
  topK?: number;
  presencePenalty?: number;
  frequencyPenalty?: number;
}
export interface IPromptOptions {
  model_parameters: IEngineParams | null;
  output_format: string;
  custom_output_format?: string;
  is_visible: boolean;
  show_output: boolean;
  prompt_output_variable: string;
}
export interface IEditPrompts extends IPromptOptions {
  id?: number;
  temp_id?: number;
  title: string;
  content: string;
  engine: number;
  dependencies: number[];
  parameters: IPromptParams[];
  order: number;
  template?: number;
  default_parameters?: IEngineParams;
}

export interface HighlightWithinTextareaRef {
  editorContainer: HTMLDivElement;
}

export interface InputVariable {
  id?: number;
  label: string;
  type: InputType;
  required: boolean;
  choices?: string[];
  fileExtensions?: string[];
}

export interface Preset extends OutputVariable {}

export interface OutputVariable {
  id?: number;
  label: string;
}

export type PresetType = "output" | "input";
export type BuilderType = "user" | "admin";

export interface IHandlePreset {
  type: PresetType | null;
  label: string;
  firstAppend?: boolean;
}

export type LinkName = "templateForm" | "list" | "test_log" | "help" | "api";

export interface ISidebarLink {
  key: LinkName;
  name: string;
  icon: ReactNode;
}
