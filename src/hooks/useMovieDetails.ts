import { useQuery } from '@tanstack/react-query';
import { getMovieDetails } from '../services/movieService';

export function useMovieDetails(movieId: number) {
  const { data: movie, isLoading, isError, refetch } = useQuery({
    queryKey: ['movie', movieId],
    queryFn: () => getMovieDetails(movieId),
  });

  return {
    movie: movie ?? null,
    loading: isLoading,
    error: isError ? 'Failed to load movie details.' : null,
    refetch,
  };
}
