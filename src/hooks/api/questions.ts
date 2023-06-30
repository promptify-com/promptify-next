import useDeferredState from "../useDeferredState";
import {client} from "../../common/axios";
import {IQuestion} from "../../common/types";

export const useQuestions = () => {
  return useDeferredState<IQuestion[]>(async () => client.get('/api/meta/questions'), [], [], []);
};