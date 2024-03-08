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
