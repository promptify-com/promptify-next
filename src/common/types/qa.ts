import {IQuestion} from "./question";
import {IOption} from "./option";


export interface IUserQA {
  question: IQuestion;
  option: IOption;
}


export interface ICheckedQA {
  [questionId: number]: number;
}