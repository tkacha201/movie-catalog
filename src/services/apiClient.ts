import { Env } from '../config/env';

const BASE_URL = 'https://api.themoviedb.org/3';
const TOKEN = Env.TMDB_TOKEN;

export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
export const posterSize = (size: 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500') =>
  `${IMAGE_BASE_URL}/${size}`;

export async function tmdbFetch<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`TMDB API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
