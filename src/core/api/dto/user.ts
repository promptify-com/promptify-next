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

// first_name
// :
// "mohamedd"
// id
// :
// 48
// last_name
// :
// "charafii"
// username
// :
// "nannuflay"

export interface UserProfile {
  id: number;
  avatar: string;
  bio: string;
  first_name: string;
  last_name: string;
  username: string;
}

export type UserPartial = Pick<User, "id" | "username" | "first_name" | "last_name" | "avatar">;

export interface UpdateUserData extends IEditProfile {}
