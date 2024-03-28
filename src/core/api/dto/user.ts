import type { IInterest, IEditProfile } from "@/common/types";
import { ChatOption } from "@/core/api/dto/chats";

export type ThemeType = "dynamic" | "blue";

export interface UserPreferences {
  id: number;
  theme: ThemeType;
  input_style: ChatOption;
  is_public: boolean;
  generation_finished: boolean;
  gpt_notification: boolean;
  monthly_report: boolean;
  newsletter: boolean;
}

export interface User {
  id: number;
  username: string;
  email: string;
  communication_email: string | null;
  role: string;
  first_name: string;
  last_name: string;
  profession: string;
  academic_level: string;
  gender: string;
  bio: string;
  avatar: string;
  date_joined: string;
  interests: IInterest[];
  created?: boolean;
  favorite_collection_id: number;
  is_admin: boolean;
  preferences: UserPreferences;
}

export type UserProfile = Pick<User, "id" | "avatar" | "bio" | "first_name" | "last_name" | "username">;

export type UserPartial = Pick<User, "id" | "username" | "first_name" | "last_name" | "avatar">;

export interface UpdateUserData extends IEditProfile {}

export type UpdateUserPreferences = Partial<UserPreferences>;
