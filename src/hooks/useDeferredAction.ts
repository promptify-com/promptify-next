import { useCallback, useMemo, useState } from "react";


const useDeferredAction = (action: (...args: Array<any>) => Promise<any>, deps: Array<any> = []) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fn = useCallback((...args: Array<any>) => {
    setIsLoading(true);
    return action(...args).then(({ data }) => {
      setIsLoading(false);
      return data;
    }).catch((error) => {
      setIsLoading(false);
      setError(error)
    });
  }, deps);

  return useMemo(() => {
    return [fn, error, isLoading]
  }, [fn, error, isLoading]) as [(...args: Array<any>) => Promise<any>, unknown, boolean]
}

export default useDeferredAction;