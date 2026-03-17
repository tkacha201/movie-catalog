import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type MovieStatus = 'watched' | 'wishlist';

export interface SavedMovie {
  id: string;
  title: string;
  posterPath: string | null;
  releaseDate: string;
  overview: string;
  rating: number;
  review: string;
  reviewImageUri: string | null;
  recommended: boolean;
  savedAt: number;
  status: MovieStatus;
}

interface MovieState {
  _userId: string | null;
  savedMovies: SavedMovie[];
  loadForUser: (userId: string) => Promise<void>;
  clearForLogout: () => void;
  /** Add or update a movie's status. Pass null to remove. */
  setMovieStatus: (
    movie: { id: string; title: string; posterPath: string | null; releaseDate: string; overview: string },
    status: MovieStatus | null,
  ) => void;
  addMovie: (movie: Omit<SavedMovie, 'rating' | 'review' | 'reviewImageUri' | 'recommended' | 'savedAt' | 'status'>) => void;
  updateMovie: (id: string, updates: Partial<Pick<SavedMovie, 'rating' | 'review' | 'reviewImageUri' | 'recommended' | 'status'>>) => void;
  deleteMovie: (id: string) => void;
  isMovieSaved: (id: string) => boolean;
  getMovieStatus: (id: string) => MovieStatus | null;
}

function storageKey(userId: string) {
  return `movie-store-${userId}`;
}

async function loadMovies(userId: string): Promise<SavedMovie[]> {
  try {
    const raw = await AsyncStorage.getItem(storageKey(userId));
    if (raw) {
      const parsed = JSON.parse(raw);
      const movies: SavedMovie[] = parsed.state?.savedMovies ?? [];
      // Filter out movies with invalid/removed statuses (e.g. old 'watching')
      return movies.filter((m) => m.status === 'watched' || m.status === 'wishlist');
    }
  } catch { /* ignore */ }
  return [];
}

async function persistMovies(userId: string | null, movies: SavedMovie[]) {
  if (!userId) return;
  await AsyncStorage.setItem(
    storageKey(userId),
    JSON.stringify({ state: { savedMovies: movies }, version: 0 })
  );
}

export const useMovieStore = create<MovieState>()((set, get) => ({
  _userId: null,
  savedMovies: [],

  loadForUser: async (userId) => {
    const movies = await loadMovies(userId);
    set({ _userId: userId, savedMovies: movies });
  },

  clearForLogout: () => {
    set({ _userId: null, savedMovies: [] });
  },

  setMovieStatus: (movie, status) => {
    const { savedMovies, _userId } = get();
    const existing = savedMovies.find((m) => m.id === movie.id);

    let updated: SavedMovie[];
    if (status === null) {
      // Remove
      updated = savedMovies.filter((m) => m.id !== movie.id);
    } else if (existing) {
      // Update status
      updated = savedMovies.map((m) =>
        m.id === movie.id ? { ...m, status } : m
      );
    } else {
      // Add new
      const newMovie: SavedMovie = {
        ...movie,
        rating: 0,
        review: '',
        reviewImageUri: null,
        recommended: false,
        savedAt: Date.now(),
        status,
      };
      updated = [newMovie, ...savedMovies];
    }
    set({ savedMovies: updated });
    persistMovies(_userId, updated);
  },

  addMovie: (movie) => {
    const { savedMovies, _userId } = get();
    const exists = savedMovies.some((m) => m.id === movie.id);
    if (exists) return;

    const newMovie: SavedMovie = {
      ...movie,
      rating: 0,
      review: '',
      reviewImageUri: null,
      recommended: false,
      savedAt: Date.now(),
      status: 'watched',
    };

    const updated = [newMovie, ...savedMovies];
    set({ savedMovies: updated });
    persistMovies(_userId, updated);
  },

  updateMovie: (id, updates) => {
    const { savedMovies, _userId } = get();
    const updated = savedMovies.map((m) =>
      m.id === id ? { ...m, ...updates } : m
    );
    set({ savedMovies: updated });
    persistMovies(_userId, updated);
  },

  deleteMovie: (id) => {
    const { savedMovies, _userId } = get();
    const updated = savedMovies.filter((m) => m.id !== id);
    set({ savedMovies: updated });
    persistMovies(_userId, updated);
  },

  isMovieSaved: (id) => {
    return get().savedMovies.some((m) => m.id === id);
  },

  getMovieStatus: (id) => {
    return get().savedMovies.find((m) => m.id === id)?.status ?? null;
  },
}));
