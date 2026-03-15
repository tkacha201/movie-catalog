import { useCallback } from 'react';
import { useFetch } from './useFetch';
import { getUpcomingMovies, type TMDBMovie } from '../services/movieService';

export function useUpcoming() {
  const fetcher = useCallback(() => getUpcomingMovies(), []);
  const { data, loading, error, refreshing, refresh } = useFetch(
    fetcher,
    'Failed to load upcoming movies.',
  );

  return {
    movies: data?.results ?? [],
    loading,
    error,
    refreshing,
    refresh,
  };
}
