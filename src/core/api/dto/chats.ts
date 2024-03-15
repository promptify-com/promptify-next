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

export type IChatPartial = Pick<IChat, "title" | "thumbnail">;

export interface ISaveChatInput {
  chat: number;
  type: "text" | "question";
  text: string;
  sender: "system" | "user";
}

interface IMessageResult {
  id: number;
  updated_at: string;
  created_at: string;
  message_type: "message" | "suggestion" | "execution" | "template";
  message_object: InputMessage | SuggestionsMessage | ExecutionMessage | TemplateMessage;
}

interface InputMessage {
  id: number;
  created_at: string;
  updated_at: string;
  text: string;
  type: string;
}

interface SuggestionsMessage {
  id: number;
  created_at: string;
  updated_at: string;
  templates: Templates[];
}

interface ExecutionMessage {
  id: number;
  created_at: string;
  updated_at: string;
  execution: TemplatesExecutions;
}

interface TemplateMessage {
  id: number;
  created_at: string;
  updated_at: string;
  text: string;
  template: Templates;
}

export interface IMessageList {
  next: string;
  previous: string;
  results: IMessageResult[];
}
