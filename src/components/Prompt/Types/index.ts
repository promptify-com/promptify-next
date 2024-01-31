import { ReactNode } from "react";

export type LinkName = "customize" | "favourite" | "executions" | "feedback" | "api" | "extension" | "details";

export type PromptInputType = string | number | File;

export interface Link {
  name: LinkName;
  icon: ReactNode;
  title: string;
}
