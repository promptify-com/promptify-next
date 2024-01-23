import { UserPartial } from "@/core/api/dto/user";

export type DeploymentStatus = "done" | "stopped" | "deploying" | "failed" | "created";

export interface Deployment {
  id: number;
  user: UserPartial;
  failure_reason: string | null;
  model: Model;
  instance: Instance;
  status: DeploymentStatus;
  created_at: string;
  name: string;
}

export interface FormikCreateDeployment {
  user: number;
  provider: string;
  region: string;
  instance: string;
  llm: string;
  name: string;
  model: string;
}

export type CreateDeployment = Pick<FormikCreateDeployment, "instance" | "model" | "name">;

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
  region: Pick<Region, "name">;
}

export interface Model {
  id: number;
  model_id: string;
  name: string;
  source: string;
  task: string;
}

export interface PaginationData<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface RegionParams {
  provider?: string;
}

export interface FilterParams {
  limit: number;
  offset: number;
  query?: string;
  region?: string;
  type?: FetchingDataType;
}

export type FetchingDataType = "models" | "instances";
