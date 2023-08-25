import { User, UserMin } from "./user";
import { Prompts } from "./prompts";

export interface FilterParams {
  categoryId?: number;
  subcategoryId?: number;
  tag?: string;
  title?: string | null;
  engineId?: number;
  ordering?: string;
  limit?: number;
  offset?: number;
}

export interface SelectedFilters {
  engine: Engine | null;
  tag: Tag[];
  title: string | null;
  category: Category | null;
  subCategory: Category | null;
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
  subcategoryId: number;
  engineId: number;
  tagId: number;
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
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  description: string;
}

export type TemplateStatus = "ALL" | "DRAFT" | "PENDING_REVIEW" | "PUBLISHED" | "ARCHIVED";

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
  likes?: number;
  favorites_count: number;
  is_liked: boolean;
  is_favorite: boolean;
  prompts_list?: [];
  executions_limit: number;
  slug: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  status: TemplateStatus;
}

export interface PromptExecutions {
  id: number;
  prompt: number;
  output: string;
  prompt_executions: PromptExecutions[];
  is_favorite: boolean;
  errors: string;
}

export interface TemplatesExecutions {
  id: number;
  title: string;
  created_at: Date;
  prompt_executions: PromptExecutions[];
  is_favorite: boolean;
  parameters: { [key: string]: any };
  contextual_overrides: { [key: string]: any };
}

export interface ITemplateExecutionPut {
  title?: string;
}

export interface ISparkWithTemplate {
  initial_title?: string;
  template?: number;
}

export interface ISparkWithExecution {
  title?: string;
  execution_id?: number;
}

export interface PromptExecutions {
  id: number;
  prompt: number;
  executed_by: number;
  output: string;
  parameters: {
    [key: number]: string | number;
  };
  content: string;
  created_at: Date;
  tokens_spent: number;
}

export interface Execution {
  id: number;
  title: string;
  created_at: string;
  is_favorite: boolean;
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
  executions: Execution[];

  likes?: number;
  favorites_count: number;
}
export interface SparkExecution {
  id: number;
  title: string;
  parameters: {
    [key: number]: string | number;
  };
  contextual_overrides: {
    [key: number]: [];
  };
  template: number;
  executed_by: number;
  created_at: string;
  prompt_executions: PromptExecutions[];
  is_favorite: boolean;
}

export interface SparkVersion {
  id: number;
  title: string;
  created_at: string;
}
export interface Spark {
  id: number;
  initial_title: string;
  created_at?: string;
  created_by?: number;
  versions: SparkVersion[];
  current_version: TemplatesExecutions;
  is_favorite?: boolean;
}

export interface CollectionMutationParams {
  collectionId: number;
  templateId: number;
}

export type ExecutionTemplatePopupType = "update" | "delete";
