import useDeferredState from "../useDeferredState";
import { authClient } from "../../common/axios";
import { IQuestion, IUser, IUserQA } from "../../common/types";
import useDeferredAction from "../useDeferredAction";
import useSetUser from "../useSetUser";
import useToken from "../useToken";

export const useGetCurrentUser = (deps: Array<any> = []) => {
  const token = useToken();
  const setUser = useSetUser();
  return useDeferredState<IUser>(async () => {
    if (!token) return {
      data: null
    };

    return await authClient.get('/api/me/').then(response => {
      setUser(response.data)
      return response
    })

  }, [token, ...deps], null);
}

export const useUpdateUser = (deps: Array<any> = []) => {
  const setUser = useSetUser();

  return useDeferredAction(async (data) => {
    return await authClient.put("/api/me/", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then(response => {
      setUser(response.data);
      return response;
    });
  }, [setUser, ...deps])
};

export const useUserAnswers = (deps: Array<any> = []) => {
  return useDeferredState<IUserQA[]>(async () => authClient.get('/api/me/answers'), deps, [], [])
}

export const useUpdateAnswers = (deps: Array<any> = []) => {
  return useDeferredAction(async (question: IQuestion, option: number) => {
    return await authClient.post(`/api/meta/questions/${question.id}/answer/`, {
      option,
    })
  }, deps);
}