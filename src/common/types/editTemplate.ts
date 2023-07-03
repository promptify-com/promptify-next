import { Prompts } from '../../core/api/dto/prompts';
import { Tag } from '../../core/api/dto/templates';

export interface IEditTemplate {
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  is_visible: boolean;
  language: string;
  category: number;
  context: string;
  tags: Tag[] | [];
  thumbnail: string;
  example?: string;
  prompts_list?: Prompts[] | [];
  executions_limit: number;
  meta_title: string;
}
