import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getMovieDetails, type TMDBMovieDetails } from '../services/movieService';
import { posterSize } from '../services/apiClient';
import { useMovieStore } from '../store/movieStore';
import type { RootStackScreenProps } from '../navigation/types';

export default function MovieDetailsScreen({ route }: RootStackScreenProps<'MovieDetails'>) {
  const { movieId } = route.params;
  const [movie, setMovie] = useState<TMDBMovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { addMovie, deleteMovie, isMovieSaved } = useMovieStore();
  const saved = useMovieStore((s) => s.isMovieSaved(String(movieId)));

  useEffect(() => {
    (async () => {
      try {
        const data = await getMovieDetails(movieId);
        setMovie(data);
      } catch {
        setError('Failed to load movie details.');
      } finally {
        setLoading(false);
      }
    })();
  }, [movieId]);

  const toggleSaved = () => {
    if (!movie) return;
    if (saved) {
      deleteMovie(String(movie.id));
    } else {
      addMovie({
        id: String(movie.id),
        title: movie.title,
        posterPath: movie.poster_path,
        releaseDate: movie.release_date,
        overview: movie.overview,
      });
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  if (error || !movie) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-8">
        <Text className="text-white text-base">{error ?? 'Movie not found.'}</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background">
      {movie.backdrop_path ? (
        <Image
          source={{ uri: `${posterSize('w780')}${movie.backdrop_path}` }}
          className="w-full h-56"
          resizeMode="cover"
        />
      ) : movie.poster_path ? (
        <Image
          source={{ uri: `${posterSize('w780')}${movie.poster_path}` }}
          className="w-full h-56"
          resizeMode="cover"
        />
      ) : (
        <View className="w-full h-56 bg-card items-center justify-center">
          <Ionicons name="film-outline" size={64} color="#AAAAAA" />
        </View>
      )}

      <View className="px-6 pt-5 pb-10">
        <Text className="text-white text-2xl font-bold mb-1">{movie.title}</Text>

        <View className="flex-row items-center gap-3 mb-4">
          <Text className="text-muted text-sm">{movie.release_date?.slice(0, 4)}</Text>
          {movie.runtime && (
            <Text className="text-muted text-sm">{movie.runtime} min</Text>
          )}
          <View className="flex-row items-center gap-1">
            <Ionicons name="star" size={14} color="#E50914" />
            <Text className="text-white text-sm font-semibold">
              {movie.vote_average.toFixed(1)}
            </Text>
          </View>
        </View>

        {movie.genres.length > 0 && (
          <View className="flex-row flex-wrap gap-2 mb-4">
            {movie.genres.map((g) => (
              <View key={g.id} className="bg-card border border-border rounded-full px-3 py-1">
                <Text className="text-muted text-xs">{g.name}</Text>
              </View>
            ))}
          </View>
        )}

        {movie.tagline ? (
          <Text className="text-muted text-sm italic mb-3">{movie.tagline}</Text>
        ) : null}

        <Text className="text-muted text-[15px] leading-6 mb-8">{movie.overview}</Text>

        <TouchableOpacity
          className={`rounded-xl py-4 flex-row items-center justify-center gap-2 ${
            saved ? 'bg-card border border-border' : 'bg-primary'
          }`}
          onPress={toggleSaved}
          activeOpacity={0.8}
        >
          <Ionicons
            name={saved ? 'heart' : 'heart-outline'}
            size={20}
            color={saved ? '#E50914' : '#FFFFFF'}
          />
          <Text className={`text-base font-semibold ${saved ? 'text-primary' : 'text-white'}`}>
            {saved ? 'Remove from My Movies' : 'Add to My Movies'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
