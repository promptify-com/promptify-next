import {IUser} from "./user";

export interface IContinueWithSocialMediaResponse extends IUser {
  token: string;
  created: boolean
}
