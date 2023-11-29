import { Category } from "@/core/api/dto/templates";
import { IEditPrompts } from "./builder";
import { ReactNode } from "react";

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
  prompts_list?: IEditPrompts[];
}

type LinkName = "executions" | "feedback" | "api" | "extension" | "details";

export interface SidebarLink {
  name: LinkName;
  icon: ReactNode;
  title: string;
}
