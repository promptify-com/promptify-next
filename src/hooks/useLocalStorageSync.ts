import { useCallback, useEffect, useSyncExternalStore } from "react";

import Storage from "@/common/storage";

const readFromLocalStorage = <T>(key: string): T | null => {
  const item = Storage.get(key);
  return item || null;
};

const subscribeToLocalStorageKey = (key: string, onChange: () => void): (() => void) => {
  const handler = (event: StorageEvent) => {
    if (event.key === key) {
      onChange();
    }
  };
  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
};

export const useLocalStorageSync = <T>(key: string, onStorageUpdate: (data: T | null) => void): T | null => {
  const subscribe = useCallback(
    (notify: () => void) => {
      return subscribeToLocalStorageKey(key, notify);
    },
    [key],
  );

  let lastKey: string | null = null;
  let lastResult: any = null;

  function getSnapshot<T>(key: string): T | null {
    if (key === lastKey) {
      return lastResult;
    }

    const result = readFromLocalStorage<T>(key);
    lastKey = key;
    lastResult = result;
    return result;
  }

  const getServerSnapshot = () => null;
  const data = useSyncExternalStore<T | null>(subscribe, () => getSnapshot<T>(key), getServerSnapshot);

  useEffect(() => {
    if (data !== null) {
      onStorageUpdate(data);
    }
  }, [data, onStorageUpdate]);

  return data;
};
