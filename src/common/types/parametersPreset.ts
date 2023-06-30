export interface IParametersPreset {
  id: number;
  name: string;
  parameters: {
    id: number;
    score: number;
  }[];
}

export interface IParametersPresetPost {
  name: string;
  parameters: {
    id: number;
    score: number
  }[];
}
