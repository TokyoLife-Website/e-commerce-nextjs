import { useCallback, useRef } from "react";

export const useDebounce = (callback: Function, delay: number = 1000) => {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const isFirstClick = useRef(true);

  return useCallback(
    (...args: any[]) => {
      if (isFirstClick.current) {
        isFirstClick.current = false;
        callback(...args);
        return;
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
};
