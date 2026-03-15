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
  savedMovies: SavedMovie[];
  addMovie: (movie: Omit<SavedMovie, 'rating' | 'review' | 'reviewImageUri' | 'recommended' | 'savedAt'>) => void;
  updateMovie: (id: string, updates: Partial<Pick<SavedMovie, 'rating' | 'review' | 'reviewImageUri' | 'recommended'>>) => void;
  deleteMovie: (id: string) => void;
  isMovieSaved: (id: string) => boolean;
}

export const useMovieStore = create<MovieState>()(
  persist(
    (set, get) => ({
      savedMovies: [],

      addMovie: (movie) => {
        const exists = get().savedMovies.some((m) => m.id === movie.id);
        if (exists) return;

        const newMovie: SavedMovie = {
          ...movie,
          rating: 0,
          review: '',
          reviewImageUri: null,
          recommended: false,
          savedAt: Date.now(),
        };

        set((state) => ({ savedMovies: [newMovie, ...state.savedMovies] }));
      },

      updateMovie: (id, updates) => {
        set((state) => ({
          savedMovies: state.savedMovies.map((m) =>
            m.id === id ? { ...m, ...updates } : m
          ),
        }));
      },

      deleteMovie: (id) => {
        set((state) => ({
          savedMovies: state.savedMovies.filter((m) => m.id !== id),
        }));
      },

      isMovieSaved: (id) => {
        return get().savedMovies.some((m) => m.id === id);
      },
    }),
    {
      name: 'movie-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
