import { IInterest } from "./interest";

export interface IUser {
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
}