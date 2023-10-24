export type DeploymentStatus = "DONE" | "STOPPED" | "DEPLOYING" | "FAILED" | "CREATED";

export interface Deployment {
  model: string;
  instance: string;
  status: DeploymentStatus;
  createdAt: string;
}
