import { User, UserPartial } from "./user";
import { Prompts } from "./prompts";
import { InputType } from "@/common/types/prompt";

export interface ExecutionWithTemplate extends TemplatesExecutions {
  template?: TemplateExecutionsDisplay;
}

export interface FilterParams {
  categoryId?: number;
  subcategoryId?: number;
  tags?: Tag[];
  title?: string | null;
  engineId?: number;
  ordering?: string;
  limit?: number;
  offset?: number;
  status?: LowercaseTemplateStatus;
  engine_type?: EngineType[];
  isFavorite?: boolean;
  isInternal?: boolean;
  template?: number;
  include?: string;
}

export type EngineType = { id: number; label: string };

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

export type EngineOutput = "TEXT" | "IMAGE" | "VIDEO" | "AUDIO";
export interface Engine {
  icon: string;
  id: number;
  input_type: string;
  name: string;
  output_type: EngineOutput;
  provider: string;
  type?: string;
}
export interface Tag {
  id: number;
  name: string;
  type?: string;
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
  is_visible: boolean;
}

export type TemplateStatus = "DRAFT" | "PENDING_REVIEW" | "PUBLISHED" | "ARCHIVED";
export type LowercaseTemplateStatus = Lowercase<TemplateStatus>;
export interface TemplateQuestions {
  [key: string]: {
    question: string;
  };
}

export interface UpdatedQuestionTemplate {
  type: InputType;
  name: string;
  fullName: string;
  required: boolean;
  question: string;
  choices?: string[];
  fileExtensions?: string[];
  prompt: number;
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
  questions: TemplateQuestions[];
  tags: Tag[];
  executions_count: number;
  last_run: Date;
  views: number;
  likes: number;
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
  last_api_run: Date;
  api_runs: number;
  example_execution: TemplatesExecutions | null;
  is_api_enabled: boolean;
  is_internal?: boolean;
}

export interface TemplatesWithPagination {
  count: number;
  next: string | null;
  previous: string | null;
  results: Templates[];
}

export type ResponseType = "arraybuffer" | "blob" | "document" | "json" | "text" | "stream";
export interface TemplatesExecutions {
  id: number;
  title: string;
  created_at: Date | string;
  prompt_executions?: PromptExecutions[];
  is_favorite: boolean;
  parameters?: {
    [key: string]: {
      [key: string]: string;
    };
  };
  contextual_overrides?: {
    [key: string]: {
      [key: string]: number;
    }[];
  };
  template?: {
    id?: number;
    title?: string;
    slug?: string;
    thumbnail?: string;
  };
  hash: string;
  feedback?: string;
  executed_by?: number;
  errors?: string;
}

export interface ITemplateExecutionPut {
  title?: string;
  feedback?: string;
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
    [key: number | string]: string | number;
  };
  content?: string;
  created_at: Date | string;
  tokens_spent: number;
  errors?: string;
}

export interface Execution {
  id: number;
  title: string;
  created_at: Date | string;
  is_favorite: boolean;
  hash: string;
  prompt_executions?: PromptExecutions[];
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
  created_by: UserPartial;
  prompts: Prompts[];
  tags: Tag[];
  slug: string;
  executions?: Execution[];
  likes?: number;
  favorites_count: number;
  executions_count: number;
  is_internal?: boolean;
  self_executions_count?: number;
  example_execution?: Execution | null;
}

export interface TemplateExecutionsWithPagination {
  count: number;
  next: string | null;
  previous: string | null;
  results: TemplatesExecutions[];
}

export type ExecutionsFilterParams = Pick<FilterParams, "limit" | "offset" | "engineId" | "engine_type" | "template">;

export interface CollectionMutationParams {
  collectionId: number;
  templateId: number;
}

export type ExecutionTemplatePopupType = "update" | "delete" | "export" | null;
export type FeedbackType = "NEUTRAL" | "LIKED" | "DISLIKED";

export interface TemplateApiStatus {
  is_api_enabled: boolean;
}

export interface TempalteApiStatusState {
  data: TemplateApiStatus | null;
  isLoading: boolean;
}

export type PopupTypes = Templates | ExecutionWithTemplate;

export interface PopupTemplateDocument {
  data: PopupTypes | null;
  previous?: PopupTypes | null;
  next?: PopupTypes | null;
}

export interface IFeedback {
  id: number;
  user: UserPartial;
  created_at: string;
  template: number;
  comment: string;
  status: "draft" | "published";
}
export interface IPostFeedback {
  template: number;
  comment: string;
  user: UserPartial;
}
export interface IPromptExecution {
  id: number;
  prompt: {
    id: number;
    title: string;
    engine: Engine;
  };
  output: string;
  created_at: Date | string;
  tokens_spent: number;
  parameters?: {
    [key: number | string]: string | number;
  };
  executed_by?: number;
  errors?: string;
}
