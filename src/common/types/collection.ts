export interface CreatedBy {
  id: number,
  username: string,
  first_name: string,
  last_name: string,
}


export interface ICollection {
  id: number,
  name: string,
  description: string,
  is_visible: boolean,
  created_at: string
  thumbnail: string,
  prompt_templates_count: number,
  likes: number,
  created_by: CreatedBy,
}
