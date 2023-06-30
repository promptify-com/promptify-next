import useDeferredState from '../useDeferredState';
import { authClient } from '../../common/axios';
import { IParameters } from '../../common/types';

export const useParameters = (deps: Array<any> = []) => {
  return useDeferredState<IParameters[]>(
    async () => authClient.get('api/meta/predefined-parameters/'),
    deps,
    [],
    [],
  );
};
