import { ITemplate } from "./template";
import { UserPartial } from "@/core/api/dto/user";

export interface ICollection {
  id: number;
  name: string;
  description: string;
  is_visible: boolean;
  created_at: string;
  thumbnail: string;
  prompt_templates_count: number;
  likes: number;
  created_by: UserPartial;
  slug: string;
}

export interface ICollectionById {
  id: number;
  name: string;
  description: string;
  is_visible: boolean;
  created_at: string;
  thumbnail: string;
  prompt_templates_count: number;
  likes: number;
  created_by: UserPartial;
  prompt_templates: ITemplate[];
}
