import { tmdbFetch, hasApiToken } from './apiClient';
import { MOCK_MOVIES, MOCK_UPCOMING, getMockMovieDetails } from './mockData';

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

function mockPaged<T>(results: T[]): TMDBPagedResponse<T> {
  return { page: 1, results, total_pages: 1, total_results: results.length };
}

export async function discoverMovies(page = 1): Promise<TMDBPagedResponse<TMDBMovie>> {
  if (!hasApiToken) return mockPaged(MOCK_MOVIES);
  return tmdbFetch<TMDBPagedResponse<TMDBMovie>>('/discover/movie', {
    page: String(page),
    sort_by: 'popularity.desc',
  });
}

export async function getMovieDetails(id: number): Promise<TMDBMovieDetails> {
  if (!hasApiToken) {
    const mock = getMockMovieDetails(id);
    if (mock) return mock;
    throw new Error('Movie not found in mock data');
  }
  return tmdbFetch<TMDBMovieDetails>(`/movie/${id}`);
}

export async function getUpcomingMovies(page = 1): Promise<TMDBPagedResponse<TMDBMovie>> {
  if (!hasApiToken) return mockPaged(MOCK_UPCOMING);
  const today = new Date().toISOString().slice(0, 10);
  const future = new Date();
  future.setMonth(future.getMonth() + 6);
  const maxDate = future.toISOString().slice(0, 10);
  return tmdbFetch<TMDBPagedResponse<TMDBMovie>>('/discover/movie', {
    page: String(page),
    sort_by: 'popularity.desc',
    with_release_type: '2|3',
    'release_date.gte': today,
    'release_date.lte': maxDate,
  });
}

export async function searchMovies(query: string, page = 1): Promise<TMDBPagedResponse<TMDBMovie>> {
  if (!hasApiToken) {
    const q = query.toLowerCase();
    const filtered = MOCK_MOVIES.filter((m) => m.title.toLowerCase().includes(q));
    return mockPaged(filtered);
  }
  return tmdbFetch<TMDBPagedResponse<TMDBMovie>>('/search/movie', {
    query,
    page: String(page),
  });
}
