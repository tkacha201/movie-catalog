import React from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { posterSize } from '../services/apiClient';
import { useMovieStore, type MovieStatus } from '../store/movieStore';
import type { RootStackScreenProps } from '../navigation/types';
import { Colors } from '../theme/colors';
import { useMovieDetails } from '../hooks/useMovieDetails';
import { useOtherReviews } from '../hooks/useOtherReviews';
import LoadingScreen from '../components/LoadingScreen';
import ErrorScreen from '../components/ErrorScreen';

export default function MovieDetailsScreen({ route }: RootStackScreenProps<'MovieDetails'>) {
  const { movieId } = route.params;
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { movie, loading, error } = useMovieDetails(movieId);

  const { addMovie, deleteMovie, setMovieStatus } = useMovieStore();
  const saved = useMovieStore((s) => s.isMovieSaved(String(movieId)));
  const savedMovie = useMovieStore((s) =>
    s.savedMovies.find((m) => m.id === String(movieId))
  );
  const currentStatus = savedMovie?.status ?? null;
  const hasReview = Boolean(savedMovie?.review);
  const { reviews: otherReviews } = useOtherReviews(String(movieId));

  const handleStatusToggle = (status: MovieStatus) => {
    if (!movie) return;
    const movieInfo = {
      id: String(movie.id),
      title: movie.title,
      posterPath: movie.poster_path,
      releaseDate: movie.release_date,
      overview: movie.overview,
    };
    setMovieStatus(movieInfo, currentStatus === status ? null : status);
  };

  const confirmDeleteReview = () => {
    Alert.alert(
      'Delete Review',
      'Remove your review for this movie? The movie will also be removed from My Movies.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteMovie(String(movieId)),
        },
      ]
    );
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
              {movie.runtime != null && movie.runtime > 0 && (
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

            {/* Status buttons */}
            <Text className="text-muted text-sm mb-2">Add to list:</Text>
            <View className="flex-row gap-2 mb-4">
              {([
                { key: 'watched', icon: 'checkmark-circle', label: 'Watched' },
                { key: 'wishlist', icon: 'bookmark', label: 'Wishlist' },
              ] as const).map(({ key, icon, label }) => {
                const isActive = currentStatus === key;
                return (
                  <TouchableOpacity
                    key={key}
                    className={`flex-1 rounded-xl py-3 items-center gap-1 ${
                      isActive ? 'bg-primary' : 'bg-card border border-border'
                    }`}
                    onPress={() => handleStatusToggle(key)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={isActive ? icon : (`${icon}-outline` as any)}
                      size={20}
                      color={isActive ? Colors.white : Colors.muted}
                    />
                    <Text className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-muted'}`}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {hasReview ? (
              <>
                {/* User's review preview */}
                <View className="bg-background rounded-xl p-4 mb-3">
                  <View className="flex-row items-center gap-2 mb-2">
                    <Ionicons name="star" size={14} color={Colors.primary} />
                    <Text className="text-white text-sm font-semibold">
                      Your rating: {savedMovie!.rating}/10
                    </Text>
                  </View>
                  <Text className="text-muted text-sm" numberOfLines={3}>
                    {savedMovie!.review}
                  </Text>
                </View>

                <View className="flex-row gap-3">
                  <TouchableOpacity
                    className="flex-1 rounded-xl py-4 flex-row items-center justify-center gap-2 bg-card border border-border"
                    activeOpacity={0.8}
                    onPress={() =>
                      navigation.navigate('AddReview', {
                        movieId: movie.id,
                        movieTitle: movie.title,
                        moviePoster: movie.poster_path,
                        movieReleaseDate: movie.release_date,
                        movieOverview: movie.overview,
                      })
                    }
                  >
                    <Ionicons name="create-outline" size={20} color={Colors.white} />
                    <Text className="text-white text-base font-semibold">Edit Review</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="rounded-xl py-4 px-5 flex-row items-center justify-center gap-2 bg-card border border-border"
                    activeOpacity={0.8}
                    onPress={confirmDeleteReview}
                  >
                    <Ionicons name="trash-outline" size={20} color={Colors.primary} />
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <TouchableOpacity
                className="rounded-xl py-4 flex-row items-center justify-center gap-2 bg-card border border-border"
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate('AddReview', {
                    movieId: movie.id,
                    movieTitle: movie.title,
                    moviePoster: movie.poster_path,
                    movieReleaseDate: movie.release_date,
                    movieOverview: movie.overview,
                  })
                }
              >
                <Ionicons name="create-outline" size={20} color={Colors.white} />
                <Text className="text-white text-base font-semibold">Write Review</Text>
              </TouchableOpacity>
            )}

            {/* Community Reviews */}
            {otherReviews.length > 0 && (
              <View className="mt-6">
                <Text className="text-white font-semibold mb-3">
                  Community Reviews ({otherReviews.length})
                </Text>
                {otherReviews.map((r) => (
                  <View key={r.userId} className="bg-background rounded-xl p-4 mb-2">
                    <View className="flex-row items-center gap-3 mb-2">
                      <View className="bg-primary w-8 h-8 rounded-full items-center justify-center">
                        <Text className="text-white text-xs font-bold">
                          {r.username.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <Text className="text-white font-semibold flex-1">{r.username}</Text>
                      <View className="flex-row items-center gap-1">
                        <Ionicons name="star" size={12} color={Colors.primary} />
                        <Text className="text-white text-sm">{r.rating}/10</Text>
                      </View>
                    </View>
                    <Text className="text-muted text-sm leading-5">{r.review}</Text>
                  </View>
                ))}
              </View>
            )}
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
