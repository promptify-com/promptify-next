import { useState, useEffect } from "react";

function useDebounce<T>(value: T, delay: number): [T, (newValue: T) => void] {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return [debouncedValue, setDebouncedValue];
}

export default useDebounce;
