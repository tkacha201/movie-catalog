import { useQuery } from '@tanstack/react-query';
import { getUpcomingMovies } from '../services/movieService';

export function useUpcoming() {
  const { data, isLoading, isError, isRefetching, refetch } = useQuery({
    queryKey: ['movies', 'upcoming'],
    queryFn: () => getUpcomingMovies(),
  });

  return {
    movies: data?.results ?? [],
    loading: isLoading,
    error: isError ? 'Failed to load upcoming movies.' : null,
    refreshing: isRefetching,
    refresh: refetch,
  };
}
