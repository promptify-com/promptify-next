import { Templates, TemplatesExecutions } from "@/core/api/dto/templates";
import { PromptInputType } from ".";
import { UserPartial } from "@/core/api/dto/user";

export interface INode {
  id: string;
  name: string;
  type: string;
  position: [number, number];
  webhookId: string;
  typeVersion: number;
}
interface IData {
  nodes: INode[];
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
export interface VaryValidatorResponse {
  [question: string]: string | number;
}

export type MessageType = "text" | "form" | "spark" | "templates" | "workflows";

export interface IMessage {
  id: number;
  text: string;
  createdAt: Date | string;
  fromUser: boolean;
  type: MessageType;
  spark?: TemplatesExecutions;
  data?: Templates[] | IWorkflow[];
  choices?: string[] | null;
  fileExtensions?: string[];
  startOver?: boolean;
  noHeader?: boolean;
  shouldStream?: boolean;
}

export interface IAnswer {
  inputName: string;
  required: boolean;
  question: string;
  answer: PromptInputType;
  prompt: number;
  error?: boolean;
}

export type AccordionChatMode = "generated_execution" | "execution" | "input" | "repeat";
