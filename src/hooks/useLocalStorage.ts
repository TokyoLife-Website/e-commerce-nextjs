import { useState, useEffect, useCallback } from "react";

type SetValue<T> = T | ((val: T) => T);

function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T | undefined, (value: SetValue<T>) => void] {
  const [storedValue, setStoredValue] = useState<T | undefined>(undefined);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const item = window.localStorage.getItem(key);
      setStoredValue(item ? (JSON.parse(item) as T) : initialValue);
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      setStoredValue(initialValue);
    }
  }, [key, initialValue]);

  const setValue = useCallback(
    (value: SetValue<T>) => {
      if (typeof window === "undefined") return;
      setStoredValue((prev) => {
        try {
          const newValue = value instanceof Function ? value(prev as T) : value;
          window.localStorage.setItem(key, JSON.stringify(newValue));
          return newValue;
        } catch (error) {
          console.error(`Error setting localStorage key "${key}":`, error);
          return prev;
        }
      });
    },
    [key]
  );

  return [storedValue, setValue];
}

export default useLocalStorage;
