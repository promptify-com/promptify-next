import type { User, UserPartial } from "@/core/api/dto/user";

interface IParameters {
  path?: string;
  options?: any;
  authentication?: string;
  nodeCredentialType?: string;
  mode?: string;
  markdown?: string;
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
}

export interface IProviderNode {
  nodeParametersCB: (content: string) => Record<string, string | number | INodeCredentials>;
  node: INode;
}

export type NodesFileData = Record<string, { iconUrl: string; name: string; type: string; description: string }>;

interface IData {
  nodes: INode[];
  connections: Record<string, INodeConnection>;
}

export interface ITemplateWorkflow {
  slug: string;
  id: number;
  name: string;
  description?: string;
  image?: string;
  created_by: User;
  data: IData;
  created_at: string;
  is_schedulable: boolean;
  is_liked: boolean;
  likes: number;
  activities?: {
    likes_count: number;
    favorites_count: number;
  };
  periodic_task?: null | {
    task: string;
    name: string;
    enabled: boolean;
    crontab: IWorkflowSchedule;
  };
  enabled: boolean;
}

export interface UserWorkflowsResponse {
  data: IWorkflowCreateResponse[];
  cursor: string | null;
}

export interface WorkflowExecution {
  id: string;
  status: string;
  startedAt: string;
  error?: string;
  data?: { resultData?: { error?: { message: string } } };
}
export interface UserWorkflowExecutionsResponse {
  data: WorkflowExecution[];
  nextCursor: null | string;
}

export type FrequencyType = "hourly" | "daily" | "weekly" | "bi-weekly" | "monthly";

export interface IWorkflowSchedule {
  frequency: FrequencyType;
  hour: number;
  minute: number;
  day_of_week: number;
  day_of_month: number;
  timezone: string;
  // month: number,
  workflow_data: {};
}

export interface INodeConnection {
  main: {
    node: string;
    type: string;
    index: number;
  }[][];
}
export interface IWorkflowCreateResponse {
  id: string;
  name: string;
  description?: string;
  image?: string;
  created_by?: UserPartial;
  nodes: INode[];
  createdAt?: Date;
  updatedAt?: Date;
  tags?: any[];
  meta?: {
    instanceId: string;
  };
  pinData?: any;
  versionId?: string;
  triggerCount?: number;
  staticData?: any;
  settings: any;
  active: boolean;
  connections: {
    [key: string]: INodeConnection;
  };
  schedule?: IWorkflowSchedule;
  periodic_task: null | {
    task: string;
    name: string;
    enabled: boolean;
    crontab: IWorkflowSchedule;
    kwargs?: string;
  };
  template_workflow: ITemplateWorkflow;
  last_executed: string | null;
}

export interface IAuthenticateBase {
  type: string;
  properties: Record<string, string>;
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

export interface INodeCredentials {
  [key: string]: {
    id: string;
    name: string;
  };
}

export interface CreateCredentialPayload {
  name: string;
  type: string;
  data: Record<string, string>;
}

export interface ICredential {
  id: string;
  name: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface IStoredWorkflows {
  [key: string]: {
    webhookPath: string;
    workflow?: IWorkflowCreateResponse;
    id: string;
  };
}

export interface IAvailableCredentials {
  id: string;
  name: string;
  type: string;
}

export interface IWorkflowCategory {
  category: string;
  templates: ITemplateWorkflow[];
}

export interface IGPTDocumentPayload {
  title: string;
  output: string;
  workflow_id: string;
}

export interface IGPTDocumentResponse {
  id: number;
  workflow: {
    id: number;
    workflow_id: string;
    created_at: string;
    updated_at: string;
    template_workflow: {
      id: number;
      name: string;
      description: string;
    };
  };
  title: string;
  output: string;
  created_at: string;
  user: number;
}
