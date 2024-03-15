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

type Sender = "system" | "user";

export interface ISaveChatInput {
  chat: number;
  type: "text" | "question";
  text: string;
  sender: Sender;
}

export interface IMessageResult {
  id: number;
  updated_at: string;
  created_at: string;
  message_type: "message" | "suggestion" | "execution" | "template";
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
}

export interface ExecutionMessage {
  id: number;
  created_at: string;
  updated_at: string;
  sender: Sender;
  execution: TemplatesExecutions;
}

export interface TemplateMessage {
  id: number;
  created_at: string;
  updated_at: string;
  sender: Sender;
  text: string;
  template: Templates;
}

export interface IMessagesList {
  next: string | null;
  previous: string | null;
  results: IMessageResult[];
}
