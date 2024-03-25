import { Category, LowercaseTemplateStatus } from "@/core/api/dto/templates";
import { IEditPrompts } from "./builder";
import { ReactNode } from "react";
import { UserPartial } from "@/core/api/dto/user";

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

export interface IFeedback {
  id: number;
  user: UserPartial;
  created_at: string;
  template: number;
  comment: string;
  status: LowercaseTemplateStatus;
}
export interface IPostFeedback {
  template: number;
  comment: string;
  user: UserPartial;
}

export interface TemplateApiStatus {
  is_api_enabled: boolean;
}

export interface TemplateApiStatusState {
  data: TemplateApiStatus | null;
  isLoading: boolean;
}
