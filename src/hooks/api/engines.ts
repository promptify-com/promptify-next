import useDeferredState from '../useDeferredState';
import { authClient } from '../../common/axios';
import { IEngines } from '../../common/types';

export const useEngines = (deps: Array<any> = []) => {
  return useDeferredState<IEngines[]>(
    async () => authClient.get('/api/meta/engines/'),
    deps,
    [],
    [],
  );
};
