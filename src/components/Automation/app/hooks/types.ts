export interface IConnection {
  [key: string]: {
    [key: string]: Array<
      Array<{
        node: string;
        type: string;
        index: number;
      }>
    >;
  };
}

export interface IGPTDocumentPayload {
  title: string;
  output: string;
  workflow_id: string;
}

interface IParameters {
  path?: string;
  options?: any;
  authentication?: string;
  nodeCredentialType?: string;
  mode?: string;
  markdown?: string;
  template?: number;
  fields?: {
    values: {
      name: string;
      stringValue?: string;
    }[];
  };

  assignments?: {
    assignments: {
      id: string;
      name: string;
      type: string;
      value: string;
    }[];
  };

  save_output?: boolean;
  template_streaming?: boolean;
  responseBody?: string;
}

export interface INode {
  id: string;
  name: string;
  iconUrl?: string;
  type: string;
  description?: string;
  position: [number, number];
  parameters: IParameters;
  typeVersion: number;
  credentials?: INodeCredentials;
  simplifyOutput?: boolean;
  query?: string;
  jsCode?: string;
  rules?: { rules: any[] };
  value1?: string;
  dataType?: string;
  include?: string;
  includeFields?: string;
  httpMethod?: string;
  responseMode?: string;
  webhookId?: string;
}

export interface INodeCredentials {
  [key: string]: {
    id: string;
    name: string;
  };
}

export interface IApp {
  active: boolean;
  connections: Record<string, INodeConnection>;
  createdAt: string;
  created_at: string;
  id: string;
  last_executed: string;
  meta: null;
  name: string;
  nodes: Array<INode>;
  periodic_task: IPeriodicTask | null;
  pinData: null;
  settings: Record<string, unknown>;
  staticData: null;
  template_workflow: ITemplateApp;
  triggerCount: number;
  updatedAt: string;
  versionId: string;
  schedule: IWorkflowSchedule;
  enabled: boolean;
  image: string;
  slug: string;
  category?: ICategory;
}

export interface ITemplateApp {
  id: number;
  name: string;
  activities: {
    likes_count: number;
    favorites_count: number;
  };
  data: {
    nodes: INode[];
    connections: Record<string, INodeConnection>;
  };
  category: ICategory;
  created_at: string;
  created_by: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    avatar: null | string;
  };
  description: string;
  enabled: boolean;
  estimated_execution_time: null | string;
  execution_count: number;
  has_output_notification: boolean;
  image: string;
  is_liked: boolean;
  is_schedulable: boolean;
  likes: number;
  slug: string;
}

export interface IPeriodicTask {
  crontab: CrontabType;
  enabled: boolean;
  frequency: FrequencyType;
  kwargs: string;
  name: string;
  task: string;
}

export type CrontabType = {
  day_of_month: string;
  day_of_week: string;
  hour: string;
  minute: string;
  month_of_year: string;
  timezone: string;
};

export interface IWorkflowSchedule {
  frequency: FrequencyType | "";
  hour: number;
  minute: number;
  day_of_week: number;
  day_of_month: number;
  timezone: string;
  workflow_data: Record<string, unknown>;
}

export interface FrequencyTime {
  day_of_week?: number | string;
  day_of_month?: number | string;
  time: number;
}
export type FrequencyType = "hourly" | "daily" | "weekly" | "bi-weekly" | "monthly" | "none";

export interface INodeConnection {
  main: {
    node: string;
    type: string;
    index: number;
  }[][];
}

export interface ICategory {
  name: string;
  description: string;
  slug: null | string;
  is_visible: boolean;
}

export interface IAppDocument {
  created_at: string;
  id: number;
  output: string;
  sent_to: [];
  title: string;
  user: number;
  workflow: {
    id: number;
    created_at: string;
    template_workflow: ITemplateApp;
    updated_at: string;
    workflow_id: number;
  };
}

export interface IUserAppResponse {
  data: IApp[];
  cursor: string | null;
}

export interface IAppCategories {
  description: string;
  name: string;
  templates: ITemplateApp[];
  total_execution_count: number;
}

export interface ICreateWorkflow {
  name: string;
  description?: string;
  created_by: {
    username: string;
    first_name: string;
    last_name: string;
  };
  category?: number;
  data?: string;
  enabled?: boolean;
  is_schedulable?: boolean;
  estimated_execution_time?: number;
  has_output_notification?: boolean;
}

export interface ICategories {
  id: number;
  description: string;
  name: string;
  is_visible: boolean;
  slug: string | null;
}

export interface IAppDocumentsResponse {
  count: number;
  results: IAppDocument[];
}

export interface IAppsTemplatesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ITemplateApp[];
}

export interface IWorkflowsResponse {
  count: number;
  results: IApp[] | ITemplateApp[];
}

export interface IWorkflowByIdResponse {
  data: {
    nodes: INode[];
  };
}

export interface ICredentialJson {
  [key: string]: ICredentialInput & {
    test: any;
    authenticate: any;
  };
}

export interface ICredentialInput {
  name: string;
  displayName: string;
  properties: ICredentialProperty[];
  iconUrl?: string;
}

export interface ICredentialProperty {
  displayName: string;
  name: string;
  type: string;
  required?: boolean;
  typeOptions?: {
    password: boolean;
  };
  default: string;
}
