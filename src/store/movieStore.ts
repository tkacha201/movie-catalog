import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
}

interface MovieState {
  /** Current user ID — drives per-user storage key */
  _userId: string | null;
  savedMovies: SavedMovie[];
  /** Call after login to load movies for this user */
  loadForUser: (userId: string) => Promise<void>;
  /** Call on logout to clear in-memory state */
  clearForLogout: () => void;
  addMovie: (movie: Omit<SavedMovie, 'rating' | 'review' | 'reviewImageUri' | 'recommended' | 'savedAt'>) => void;
  updateMovie: (id: string, updates: Partial<Pick<SavedMovie, 'rating' | 'review' | 'reviewImageUri' | 'recommended'>>) => void;
  deleteMovie: (id: string) => void;
  isMovieSaved: (id: string) => boolean;
}

function storageKey(userId: string) {
  return `movie-store-${userId}`;
}

async function loadMovies(userId: string): Promise<SavedMovie[]> {
  try {
    const raw = await AsyncStorage.getItem(storageKey(userId));
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed.state?.savedMovies ?? [];
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
}));
