import { useState, useEffect } from "react";

import Storage from "@/common/storage";

function useLocalStorage(key: string, initialValue: any) {
  const [storedValue, setStoredValue] = useState(() => {
    const item = Storage.get(key);
    return item !== null ? item : initialValue;
  });

  useEffect(() => {
    Storage.set(key, JSON.stringify(storedValue));
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;
