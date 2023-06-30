import useDeferredState from "../useDeferredState";
import {authClient, client} from "../../common/axios";
import useDeferredAction from "../useDeferredAction";
import {IInterest} from "../../common/types";


export const useInterests = () => {
  return useDeferredState<IInterest[]>(async () => client.get('/api/meta/interests'), [], [], [])
}

export const useUpdateInterests = () => {
  return useDeferredAction(async (ids) => {
    if (ids.length === 0) return;

    await authClient.put("/api/me/interests/", {
      interests: ids,
    });
  }, []);
}