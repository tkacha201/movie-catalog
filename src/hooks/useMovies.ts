import { useState, useEffect, useCallback, useMemo } from 'react';
import { discoverMovies, searchMovies, type TMDBMovie } from '../services/movieService';

export function useMovies() {
  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState('');

  const fetchMovies = useCallback(async (searchQuery?: string) => {
    try {
      setError(null);
      const data = searchQuery?.trim()
        ? await searchMovies(searchQuery.trim())
        : await discoverMovies();
      setMovies(data.results);
    } catch {
      setError('Failed to load movies.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  // Debounced search
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!loading) fetchMovies(query);
    }, 500);
    return () => clearTimeout(timeout);
  }, [query, fetchMovies, loading]);

  const refresh = useCallback(() => {
    setRefreshing(true);
    fetchMovies(query);
  }, [fetchMovies, query]);

  return useMemo(
    () => ({ movies, loading, error, refreshing, query, setQuery, refresh }),
    [movies, loading, error, refreshing, query, refresh],
  );
}
