import type { User, UserPartial } from "@/core/api/dto/user";

interface IParameters {
  path?: string;
  options?: any;
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
  id: number;
  name: string;
  description?: string;
  image?: string;
  created_by: UserPartial;
  nodes: INode[];
  created_at: Date;
}
