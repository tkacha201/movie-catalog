import { useCallback } from 'react';
import { useFetch } from './useFetch';
import { getMovieDetails, type TMDBMovieDetails } from '../services/movieService';

export function useMovieDetails(movieId: number) {
  const fetcher = useCallback(() => getMovieDetails(movieId), [movieId]);
  const { data: movie, loading, error } = useFetch(
    fetcher,
    'Failed to load movie details.',
  );

  return { movie, loading, error };
}
