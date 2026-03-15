import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getMovieDetails, type TMDBMovieDetails } from '../services/movieService';
import { posterSize } from '../services/apiClient';
import { useMovieStore } from '../store/movieStore';
import type { RootStackScreenProps } from '../navigation/types';
import { Colors } from '../theme/colors';
import LoadingScreen from '../components/LoadingScreen';
import ErrorScreen from '../components/ErrorScreen';

export default function MovieDetailsScreen({ route }: RootStackScreenProps<'MovieDetails'>) {
  const { movieId } = route.params;
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [movie, setMovie] = useState<TMDBMovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { addMovie, deleteMovie } = useMovieStore();
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

  if (loading) return <LoadingScreen />;

  if (error || !movie) return <ErrorScreen message={error ?? 'Movie not found.'} />;

  const posterUri = movie.poster_path
    ? `${posterSize('w780')}${movie.poster_path}`
    : movie.backdrop_path
    ? `${posterSize('w780')}${movie.backdrop_path}`
    : null;

  return (
    <View className="flex-1 bg-background">
      {/* Back button */}
      <TouchableOpacity
        className="absolute z-10 bg-black/50 p-2 rounded-full"
        style={localStyles.backButton(insets.top)}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={24} color={Colors.white} />
      </TouchableOpacity>

      <ScrollView className="flex-1" bounces={false}>
        {/* Full-width poster */}
        {posterUri ? (
          <View className="w-full h-[500px]">
            <Image
              source={{ uri: posterUri }}
              className="w-full h-full"
              resizeMode="cover"
            />
            {/* Gradient overlay */}
            <View className="absolute inset-x-0 bottom-0 h-40 bg-background" style={localStyles.gradientOverlay} />
          </View>
        ) : (
          <View className="w-full h-64 bg-card items-center justify-center">
            <Ionicons name="film-outline" size={64} color={Colors.muted} />
          </View>
        )}

        {/* Info card */}
        <View className="px-4 pb-10" style={localStyles.infoCardOffset}>
          <View className="bg-card rounded-xl p-6">
            <Text className="text-white text-2xl font-bold mb-3">{movie.title}</Text>

            {/* Year & Rating */}
            <View className="flex-row items-center gap-4 mb-4">
              <Text className="text-muted">{movie.release_date?.slice(0, 4)}</Text>
              {movie.runtime && (
                <Text className="text-muted">{movie.runtime} min</Text>
              )}
              <View className="flex-row items-center gap-1.5">
                <Ionicons name="star" size={18} color={Colors.primary} />
                <Text className="text-white font-semibold">
                  {movie.vote_average.toFixed(1)}/10
                </Text>
              </View>
            </View>

            {/* Genre tags */}
            {movie.genres.length > 0 && (
              <View className="flex-row flex-wrap gap-2 mb-6">
                {movie.genres.map((g) => (
                  <View key={g.id} className="rounded-full px-3 py-1 border border-primary" style={localStyles.genrePillBg}>
                    <Text className="text-primary text-xs">{g.name}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Synopsis */}
            <Text className="text-white font-semibold mb-2">Synopsis</Text>
            <Text className="text-muted text-[15px] leading-6 mb-6">{movie.overview}</Text>

            {/* Action buttons */}
            <TouchableOpacity
              className={`rounded-xl py-4 flex-row items-center justify-center gap-2 mb-3 ${
                saved ? 'bg-border border border-primary' : 'bg-primary'
              }`}
              onPress={toggleSaved}
              activeOpacity={0.8}
            >
              <Ionicons
                name={saved ? 'checkmark' : 'add'}
                size={20}
                color={saved ? Colors.primary : Colors.white}
              />
              <Text className={`text-base font-semibold ${saved ? 'text-white' : 'text-white'}`}>
                {saved ? 'In My Movies' : 'Add to My Movies'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="rounded-xl py-4 flex-row items-center justify-center gap-2 bg-card border border-border"
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate('AddReview', {
                  movieId: movie.id,
                  movieTitle: movie.title,
                  moviePoster: movie.poster_path,
                })
              }
            >
              <Ionicons name="create-outline" size={20} color={Colors.white} />
              <Text className="text-white text-base font-semibold">Write Review</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const localStyles = {
  backButton: (topInset: number) => ({ top: topInset + 8, left: 16 }),
  gradientOverlay: { opacity: 0.9 },
  infoCardOffset: { marginTop: -64 },
  genrePillBg: { backgroundColor: Colors.primaryAlpha },
} as const;
