import { useEffect, useState } from 'react';

interface UseLoadingProps {
  isLoading?: boolean;
  isFetching?: boolean;
  delay?: number;
}

export const useLoading = ({ isLoading, isFetching, delay = 300 }: UseLoadingProps) => {
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isLoading || isFetching) {
      timeoutId = setTimeout(() => {
        setShowLoading(true);
      }, delay);
    } else {
      setShowLoading(false);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isLoading, isFetching, delay]);

  return showLoading;
};