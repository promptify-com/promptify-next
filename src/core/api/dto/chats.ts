import type { ITemplateWorkflow } from "@/components/Automation/types";
import type { Templates, TemplatesExecutions } from "./templates";

export interface IChat {
  id: number;
  created_at: string;
  updated_at: string;
  title: string;
  last_message?: string;
  thumbnail?: string;
  created_by?: number;
}

export type ChatOption = "qa" | "form";

export type IChatPartial = Pick<IChat, "title" | "thumbnail">;

type Sender = "system" | "user";

interface ISaveChatMessage {
  chat: number;
  message_type?: IMessageResult["message_type"];
}

export interface ISaveChatInput extends ISaveChatMessage {
  type: "text" | "question" | "html";
  text: string;
  sender: Sender;
}
export interface ISaveChatTemplate extends ISaveChatMessage {
  text: string;
  template: number;
}
export interface ISaveChatSuggestions extends ISaveChatMessage {
  text: string;
  templates?: number[];
  workflows?: number[];
}
export interface ISaveChatExecutions extends ISaveChatMessage {
  execution: number;
  type: ChatOption;
}

export type BatchingMessages = ISaveChatTemplate | ISaveChatExecutions | ISaveChatInput;
export type BatchingRequest = Array<BatchingMessages>;

export interface IMessageResult {
  id: number;
  updated_at: string;
  created_at: string;
  message_type: "message" | "templates_suggestion" | "workflows_suggestion" | "execution" | "template";
  message_object: InputMessage | SuggestionsMessage | ExecutionMessage | TemplateMessage;
}

export interface InputMessage {
  id: number;
  created_at: string;
  updated_at: string;
  sender: Sender;
  text: string;
  type: string;
}

export interface SuggestionsMessage {
  id: number;
  created_at: string;
  updated_at: string;
  sender: Sender;
  templates: Templates[];
  workflows: ITemplateWorkflow[];
  text: string;
}

export interface TemplateMessage {
  id: number;
  created_at: string;
  updated_at: string;
  sender: Sender;
  text: string;
  template: Templates;
}

export interface ExecutionMessage {
  created_at: string;
  updated_at: string;
  id: number;
  execution: TemplatesExecutions;
  type: ChatOption;
}

export interface IMessagesList {
  next: string | null;
  previous: string | null;
  results: IMessageResult[];
}
