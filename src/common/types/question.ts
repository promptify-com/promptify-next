import {IOption} from "./option";

export interface IQuestion {
  id: number;
  text: string;
  options: IOption[];
}
