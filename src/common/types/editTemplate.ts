import { Tag, TemplateStatus } from "@/core/api/dto/templates";
import { IEditPrompts } from "./builder";

export interface IEditTemplate {
  slug?: string;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  is_visible: boolean;
  language: string;
  category: number;
  context: string;
  tags: Tag[] | [];
  thumbnail: string;
  example?: string;
  prompts_list?: IEditPrompts[] | [];
  executions_limit: number;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  status: TemplateStatus;
  example_execution?: number | null;
  is_internal?: boolean;
}
