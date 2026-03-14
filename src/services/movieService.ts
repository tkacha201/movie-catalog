import { tmdbFetch } from './apiClient';

export interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  overview: string;
  vote_average: number;
  genre_ids?: number[];
}

export interface TMDBMovieDetails extends TMDBMovie {
  runtime: number | null;
  genres: { id: number; name: string }[];
  tagline: string;
}

interface TMDBPagedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export async function discoverMovies(page = 1): Promise<TMDBPagedResponse<TMDBMovie>> {
  return tmdbFetch<TMDBPagedResponse<TMDBMovie>>('/discover/movie', {
    page: String(page),
    sort_by: 'popularity.desc',
  });
}

export async function getMovieDetails(id: number): Promise<TMDBMovieDetails> {
  return tmdbFetch<TMDBMovieDetails>(`/movie/${id}`);
}

export async function getUpcomingMovies(page = 1): Promise<TMDBPagedResponse<TMDBMovie>> {
  const today = new Date().toISOString().slice(0, 10);
  const endOfYear = `${new Date().getFullYear()}-12-31`;
  return tmdbFetch<TMDBPagedResponse<TMDBMovie>>('/discover/movie', {
    page: String(page),
    sort_by: 'release_date.asc',
    'primary_release_date.gte': today,
    'primary_release_date.lte': endOfYear,
    with_release_type: '2|3',
  });
}

export async function searchMovies(query: string, page = 1): Promise<TMDBPagedResponse<TMDBMovie>> {
  return tmdbFetch<TMDBPagedResponse<TMDBMovie>>('/search/movie', {
    query,
    page: String(page),
  });
}
