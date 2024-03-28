export interface IEditProfile {
  username?: string;
  communication_email?: string;
  first_name?: string;
  last_name?: string;
  gender?: string;
  avatar?: File | null;
  bio?: string;
}
