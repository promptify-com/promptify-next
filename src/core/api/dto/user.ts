import { IInterest } from '../../../common/types';

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
}
