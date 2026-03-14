import { create } from 'zustand';

export interface SavedMovie {
  id: string;
  title: string;
  posterPath: string | null;
  releaseDate: string;
  overview: string;
  rating: number;
  review: string;
  reviewImageUri: string | null;
  savedAt: number;
}

interface MovieState {
  savedMovies: SavedMovie[];
  addMovie: (movie: Omit<SavedMovie, 'rating' | 'review' | 'reviewImageUri' | 'savedAt'>) => void;
  updateMovie: (id: string, updates: Partial<Pick<SavedMovie, 'rating' | 'review' | 'reviewImageUri'>>) => void;
  deleteMovie: (id: string) => void;
  isMovieSaved: (id: string) => boolean;
}

export const useMovieStore = create<MovieState>((set, get) => ({
  savedMovies: [],

  addMovie: (movie) => {
    const exists = get().savedMovies.some((m) => m.id === movie.id);
    if (exists) return;

    const newMovie: SavedMovie = {
      ...movie,
      rating: 0,
      review: '',
      reviewImageUri: null,
      savedAt: Date.now(),
    };

    // TODO: replace with Firestore addDoc()
    set((state) => ({ savedMovies: [newMovie, ...state.savedMovies] }));
  },

  updateMovie: (id, updates) => {
    // TODO: replace with Firestore updateDoc()
    set((state) => ({
      savedMovies: state.savedMovies.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      ),
    }));
  },

  deleteMovie: (id) => {
    // TODO: replace with Firestore deleteDoc()
    set((state) => ({
      savedMovies: state.savedMovies.filter((m) => m.id !== id),
    }));
  },

  isMovieSaved: (id) => {
    return get().savedMovies.some((m) => m.id === id);
  },
}));
