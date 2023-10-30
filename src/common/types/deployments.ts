export type DeploymentStatus = "done" | "stopped" | "deploying" | "failed" | "created";

export interface Deployment {
  id: number;
  user: number;
  failure_reason: string | null;
  model: ModelFields;
  instance: Instance;
  status: DeploymentStatus;
  created_at: string;
}

export interface FormikCreateDeployment {
  user: number;
  provider: string;
  region: string;
  instance: string;
  llm: string;
  model: string;
}

export interface CreateDeployment {
  model: string;
  instance: string;
}

export interface Region {
  id: number;
  name: string;
  short_name: string;
  endpoint: string;
  protocol: string;
  provider: string;
}

export interface Instance {
  id: number;
  instance_type: string;
  vcpus: number;
  num_gpus: number;
  memory: number;
  cost: number;
  region: number;
}

export interface ModelFields {
  model_id: string;
  name: string;
  source: string;
  task: string;
}

export interface Model {
  model: string;
  pk: number;
  fields: ModelFields;
}

export interface RegionParams {
  provider?: string;
}

export interface InstanceParams {
  region?: string;
}
