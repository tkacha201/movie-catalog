import { useState, useCallback, useEffect } from 'react';

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  refresh: () => void;
}

export function useFetch<T>(
  fetcher: () => Promise<T>,
  errorMessage = 'Failed to load data.',
): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const execute = useCallback(async () => {
    try {
      setError(null);
      const result = await fetcher();
      setData(result);
    } catch {
      setError(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fetcher, errorMessage]);

  useEffect(() => {
    execute();
  }, [execute]);

  const refresh = useCallback(() => {
    setRefreshing(true);
    execute();
  }, [execute]);

  return { data, loading, error, refreshing, refresh };
}
