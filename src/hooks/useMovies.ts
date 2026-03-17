import { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { discoverMovies, searchMovies } from '../services/movieService';

export function useMovies() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const queryClient = useQueryClient();

  // Debounce search query (2s after user stops typing)
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(query), 2000);
    return () => clearTimeout(timeout);
  }, [query]);

  const searchTerm = debouncedQuery.trim();
  const shouldSearch = searchTerm.length >= 2;

  const { data, isLoading, isError, isRefetching, isFetching, refetch } = useQuery({
    queryKey: ['movies', shouldSearch ? searchTerm : ''],
    queryFn: () =>
      shouldSearch
        ? searchMovies(searchTerm)
        : discoverMovies(),
    placeholderData: (prev) => prev,
  });

  const refresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['movies', debouncedQuery] });
  }, [queryClient, debouncedQuery]);

  return {
    movies: data?.results ?? [],
    loading: isLoading,
    searching: isFetching && !isLoading,
    error: isError ? 'Failed to load movies.' : null,
    refreshing: isRefetching,
    query,
    setQuery,
    refresh,
  };
}
