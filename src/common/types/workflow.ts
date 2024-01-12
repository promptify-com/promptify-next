import { User } from "@/core/api/dto/user";

export interface INode {
  id: string;
  name: string;
  type: string;
  position: [number, number];
  webhookId?: string; // Optional as not all nodes have webhookId
  parameters: {
    path?: string;
    options?: any; // 'options' can have various structures
    fields?: {
      values: {
        name: string;
        stringValue?: string;
      }[];
    };
    simplifyOutput?: boolean;
    query?: string;
    jsCode?: string;
    rules?: {
      rules: any[]; // 'rules' can have various structures
    };
    value1?: string;
    dataType?: string;
    include?: string;
    includeFields?: string;
    httpMethod?: string;
    responseMode?: string;
    // Add other specific properties as needed
  };
  typeVersion: number;
}

export interface IWorkflow {
  id: number;
  name: string;
  description?: string;
  image?: string;
  created_by: User;
  data: {
    nodes: INode[];
  };
  created_at: Date;
}
