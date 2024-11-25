import { IApp } from "@/core/api/apps/types";
import type { IAnswer, ITemplateApp } from "@/core/store/appSlice/types";

export interface IMessage {
  id?: number;
  type: MessageType;
  text?: string;
  fromUser?: boolean;
  noHeader?: boolean;
  isHighlight?: boolean;
  timestamp?: string;
  isRequired?: boolean;
  questionIndex?: number;
  data?: MessageDataType;
  choices?: string[];
}

type MessageDataType = ITemplateApp[] | IApp | IAnswer[];

export type InputType = "text" | "choices" | "number" | "integer" | "code" | "file" | "credentials" | "audio";

export type MessageType =
  | "text"
  | "workflow_data"
  | "html"
  | "credentials"
  | "readyMessage"
  | "workflowExecution"
  | "input"
  | "API_instructions"
  | InputType;

export interface IToolBarOption {
  icon: JSX.Element;
  label: string;
  show?: boolean;
  onClick: () => void;
}
