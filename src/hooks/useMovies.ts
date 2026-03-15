import { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { discoverMovies, searchMovies } from '../services/movieService';

export function useMovies() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const queryClient = useQueryClient();

  // Debounce search query
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(timeout);
  }, [query]);

  const { data, isLoading, isError, isRefetching, refetch } = useQuery({
    queryKey: ['movies', debouncedQuery],
    queryFn: () =>
      debouncedQuery.trim()
        ? searchMovies(debouncedQuery.trim())
        : discoverMovies(),
  });

  const refresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['movies', debouncedQuery] });
  }, [queryClient, debouncedQuery]);

  return {
    movies: data?.results ?? [],
    loading: isLoading,
    error: isError ? 'Failed to load movies.' : null,
    refreshing: isRefetching,
    query,
    setQuery,
    refresh,
  };
}
