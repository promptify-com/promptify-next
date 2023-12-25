import { UserPartial } from "@/core/api/dto/user";

interface IParameters {
  fields?: {
    values: { name: string; stringValue: string }[];
  };
  options?: Record<string, string | number>;
}

export interface INode {
  id: string;
  name: string;
  type: string;
  position: [number, number];
  webhookId: string;
  parameters: IParameters;
  typeVersion: number;
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
  created_by: UserPartial;
  data: IData;
  created_at: string;
}
