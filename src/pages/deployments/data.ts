import { Deployment, DeploymentStatus } from "@/common/types/deployments";

export const deployments: Deployment[] = [
  {
    model: "lorem ipsum open ai",
    instance: "lorem ipsum open instance",
    status: "DEPLOYING",
    createdAt: "2 days",
  },
  {
    model: "lorem ipsum open ai",
    instance: "lorem ipsum open instance",
    status: "DONE",
    createdAt: "2 days",
  },
  {
    model: "lorem ipsum open ai",
    instance: "lorem ipsum open instance",
    status: "FAILED",
    createdAt: "2 days",
  },
  {
    model: "lorem ipsum open ai",
    instance: "lorem ipsum open instance",
    status: "STOPPED",
    createdAt: "2 days",
  },
  {
    model: "lorem ipsum open ai",
    instance: "lorem ipsum open instance",
    status: "CREATED",
    createdAt: "2 days",
  },
];
