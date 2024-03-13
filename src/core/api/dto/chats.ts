import { MessageType } from "@/components/Prompt/Types/chat";

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
