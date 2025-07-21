import { useCallback, useRef } from "react";

export const useDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 1000
) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
  const isFirstClick = useRef(true);

  return useCallback(
    (...args: Parameters<T>) => {
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
