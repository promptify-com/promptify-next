import { authClient } from "../../common/axios";
import { IConnection } from "../../common/types";
import useDeferredAction from "../useDeferredAction";
import useDeferredState from "../useDeferredState";


export const useConnections = (deps: Array<any> = []) => {
    return useDeferredState<IConnection[]>(async () => await authClient.get('/api/me/connections'), deps, [], [])
}


export const useConnectionss = () => {

    return useDeferredAction(async () => {

        return await authClient.get('/api/me/connections')
    }, [])
}



export const useDeleteConnection = () => {
    return useDeferredAction(async (id: number) => {

        if (!id) return;
        return await authClient.delete(`/api/me/connections/${id}`);
    }, []);
}
