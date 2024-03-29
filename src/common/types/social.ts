import { User } from "@/core/api/dto/user";

export interface IContinueWithSocialMediaResponse extends User {
  token: string;
  created: boolean;
}
