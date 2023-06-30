import useDeferredState from "../useDeferredState";
import { authClient, client } from "../../common/axios";
import { ICollection } from "../../common/types/collection";
import useDeferredAction from "../useDeferredAction";

export const useCollections = () => {
  return useDeferredState<ICollection[]>(async () => client.get('/api/meta/collections/'), [], [], []);
};


export const useCollection = () => {

  return useDeferredAction(async () => {

    return await authClient.get('/api/meta/collections/')
  }, [])
}
