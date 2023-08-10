import { Category } from "@/core/api/dto/templates";
import { INodesData } from "./builder";

export type FormType = "create" | "edit";

export interface ITemplate {
  slug: string;
  id: number;
  title: string;
  description: string;
  example: string;
  thumbnail: string;
  is_visible: boolean;
  language: string;
  category: Category;
  difficulty: string;
  duration: string;
  prompts_list?: INodesData[];
}
