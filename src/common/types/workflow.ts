interface User {
  id: number;
  username: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
}

interface Node {
  id: string;
  name: string;
  type: string;
  position: [number, number];
  webhookId: string;
  parameters: Record<string, any>;
  typeVersion: number;
}

export interface IWorkflow {
  id: number;
  name: string;
  description?: string;
  image?: string;
  created_by: User;
  nodes: Node[];
  created_at: string;
}
