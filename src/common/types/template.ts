import { INodesData } from "./builder";

export interface ITemplate {
    id: number,
    title: string;
    description: string;
    example: string;
    thumbnail: string;
    is_visible: boolean;
    language: string;
    category: number;
    difficulty: string;
    duration: string;
    prompts_list?: INodesData[];
  }