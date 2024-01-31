import { ReactNode } from "react";

export type LinkName = "customize" | "clone" | "favorite" | "executions" | "feedback" | "api" | "extension" | "details";

export type PromptInputType = string | number | File;

export interface Link {
  name: LinkName;
  icon: ReactNode;
  title: string;
}
