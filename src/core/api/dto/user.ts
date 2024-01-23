import { IInterest, IEditProfile } from "@/common/types";

export interface User {
  id: number;
  username: string;
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
}

export type UserPartial = Pick<User, "id" | "username" | "first_name" | "last_name" | "avatar">;

export interface UpdateUserData extends IEditProfile {}
