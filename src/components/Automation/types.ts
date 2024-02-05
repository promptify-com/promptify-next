import type { User, UserPartial } from "@/core/api/dto/user";

interface IParameters {
  path?: string;
  options?: any;
  authentication?: string;
  nodeCredentialType?: string;

  fields?: {
    values: {
      name: string;
      stringValue?: string;
    }[];
  };
}

export interface INode {
  id: string;
  name: string;
  type: string;
  position: [number, number];
  webhookId: string;
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

export type NodesFileData = Record<string, Pick<INode, "name" | "type">>;

interface IConnections {
  [key: string]: [{ node: string; type: string; index: number }][];
}

interface IData {
  nodes: INode[];
  connections: Record<string, IConnections>;
}

export interface IWorkflow {
  id: number;
  name: string;
  description?: string;
  image?: string;
  created_by: User;
  data: IData;
  created_at: string;
}

export interface IWorkflowCreateResponse {
  id?: string;
  name: string;
  description?: string;
  image?: string;
  created_by: UserPartial;
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
  connections: any;
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
  [key: string]: ICredential & {
    test: any;
    authenticate: any;
  };
}

export interface ICredential {
  name: string;
  displayName: string;
  properties: ICredentialProperty[];
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

export interface CredentialResponse {
  name: string;
  type: string;
  id: string;
  createdAt: string;
  updatedAt: string;
}
