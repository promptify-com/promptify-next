import { useEffect, useMemo, useState } from "react";

type IDeferredState<T> = [T, any, boolean];

const useDeferredState = <T>(
  action: () => Promise<any>,
  deps: Array<any> = [],
  defaultValue?: any,
  initialState?: any,
): IDeferredState<T> => {
  const [data, setData] = useState<T>(initialState);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    action()
      .then(r => {
        setData(r.data);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err);
        setIsLoading(false);
      });
  }, deps);

  return useMemo(() => {
    if (isLoading) {
      return [defaultValue, error, isLoading];
    }

    return [data, error, isLoading];
  }, [isLoading]);
};

export default useDeferredState;
