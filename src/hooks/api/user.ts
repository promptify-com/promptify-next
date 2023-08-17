import useDeferredState from "@/hooks/useDeferredState";
import { authClient } from "@/common/axios";
import { IQuestion, IUserQA } from "@/common/types";
import useDeferredAction from "@/hooks/useDeferredAction";

export const useUserAnswers = (deps: Array<any> = []) => {
  return useDeferredState<IUserQA[]>(
    async () => authClient.get("/api/me/answers"),
    deps,
    [],
    []
  );
};

export const useUpdateAnswers = (deps: Array<any> = []) => {
  return useDeferredAction(async (question: IQuestion, option: number) => {
    return await authClient.post(`/api/meta/questions/${question.id}/answer/`, {
      option,
    });
  }, deps);
};
