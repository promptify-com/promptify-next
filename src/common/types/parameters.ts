export interface IParameters {
  id: number;
  name: string;
  code: string;
  type: string;
  category: number;
  score_descriptions: {
    score: number;
    description: string;
  }[];
}
