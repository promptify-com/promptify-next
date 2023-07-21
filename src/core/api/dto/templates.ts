import { User, UserMin } from "./user";
import { Prompts } from "./prompts";

export interface FilterParams {
  categoryId?: number;
  subcategoryId?: string;
  engineId?: number;
  filter?: string;
}

export class TemplateParam {
  type: string;
  value: any;

  constructor(type: string, value: any) {
    this.type = type;
    this.value = value;
  }
}

export interface TemplateKeyWordTag {
  tag: string;
  keyword: string;
}

export interface TemplateIds {
  categoryId: number;
  subcategoryId: string;
  engineId: string;
}

export interface Engine {
  icon: string;
  id: number;
  input_type: string;
  name: string;
  output_type: string;
  provider: string;
}
export interface Tag {
  id: number;
  name: string;
}

interface CategoryParent {
  id: number;
  name: string;
  parent?: CategoryParent;
}

export interface Category {
  id: number;
  name: string;
  parent?: CategoryParent;
  image: string;
  prompt_template_count: number;
  slug: string;
}

export interface Templates {
  id: number;
  title: string;
  description: string;
  example: string;
  thumbnail: string;
  difficulty: string;
  duration: number;
  is_visible: boolean;
  language: string;
  category: Category;
  context: string;
  created_by: User;
  created_at: Date;
  updated_at: Date;
  prompts: Prompts[];
  tags: Tag[];
  executions_count: number;
  last_run: Date;
  views: number;
  likes: number;
  is_liked: boolean;
  is_favorite: boolean;
  prompts_list?: [];
  executions_limit: number;
  slug: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
}

export interface PromptExecutions {
  id: number;
  prompt: number;
  output: string;
  prompt_executions: PromptExecutions[];
  is_favorite: boolean;
}

export interface TemplatesExecutions {
  id: number;
  title: string;
  created_at: Date;
  prompt_executions: PromptExecutions[];
  is_favorite: boolean;
}

export interface ITemplateExecutionPut {
  title?: string;
}

export interface PromptExecutions {
  content: string;
  created_at: Date;
  executed_by: number;
  id: number;
  output: string;
  parameters: {
    [key: number]: string | number;
  };
  prompt: number;
}
export interface PromptExecutionResponse {
  contextual_overrides: {
    [key: number]: [];
  };
  created_at: Date;
  executed_by: number;
  id: number;
  parameters: {
    [key: number]: string | number;
  };
  prompt_executions: PromptExecutions[];
  template: number;
}

export interface TemplateExecutionsDisplay {
  id: number;
  title: string;
  category: {
    id: number;
    name: string;
  };
  description: string;
  thumbnail: string;
  created_by: UserMin;
  tags: Tag[];
  slug: string;
  executions: {
    id: number;
    title: string;
    created_at: string;
  }[];
  likes: number;
}