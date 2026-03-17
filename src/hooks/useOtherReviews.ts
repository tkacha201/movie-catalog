import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllUsers } from '../store/authStore';
import { useAuthStore } from '../store/authStore';
import type { SavedMovie } from '../store/movieStore';

export interface OtherReview {
  userId: string;
  username: string;
  rating: number;
  review: string;
}

export function useOtherReviews(movieId: string) {
  const currentUserId = useAuthStore((s) => s.user?.id);
  const [reviews, setReviews] = useState<OtherReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const users = await getAllUsers();
        const results: OtherReview[] = [];

        for (const user of users) {
          if (user.id === currentUserId) continue;

          const raw = await AsyncStorage.getItem(`movie-store-${user.id}`);
          if (!raw) continue;

          const parsed = JSON.parse(raw);
          const movies: SavedMovie[] = parsed.state?.savedMovies ?? [];
          const match = movies.find((m) => m.id === movieId);

          if (match && match.review) {
            results.push({
              userId: user.id,
              username: user.username,
              rating: match.rating,
              review: match.review,
            });
          }
        }

        if (!cancelled) {
          setReviews(results);
          setLoading(false);
        }
      } catch {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [movieId, currentUserId]);

  return { reviews, loading };
}
