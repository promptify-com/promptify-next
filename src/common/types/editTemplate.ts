import { Prompts } from "@/core/api/dto/prompts";
import { Tag, TemplateStatus } from "@/core/api/dto/templates";

export interface IEditTemplate {
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
  prompts_list?: Prompts[] | [];
  executions_limit: number;
  slug: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  status: TemplateStatus;
}
