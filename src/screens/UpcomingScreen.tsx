import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, Image, TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getUpcomingMovies, type TMDBMovie } from '../services/movieService';
import { posterSize } from '../services/apiClient';
import { Colors } from '../theme/colors';
import { useAppNavigation } from '../hooks/useAppNavigation';
import LoadingScreen from '../components/LoadingScreen';
import ErrorScreen from '../components/ErrorScreen';

function daysUntil(dateStr: string): number {
  const release = new Date(dateStr);
  const now = new Date();
  return Math.ceil((release.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function UpcomingScreen() {
  const navigation = useAppNavigation();
  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUpcoming = useCallback(async () => {
    try {
      setError(null);
      const data = await getUpcomingMovies();
      setMovies(data.results);
    } catch {
      setError('Failed to load upcoming movies.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchUpcoming();
  }, [fetchUpcoming]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUpcoming();
  };

  if (loading) return <LoadingScreen />;

  if (error) return <ErrorScreen message={error} onRetry={fetchUpcoming} />;

  return (
    <View className="flex-1 bg-background">
      <Text className="text-white text-2xl font-bold px-5 pt-14 pb-4">
        Upcoming Releases
      </Text>
      <FlatList
        data={movies}
        keyExtractor={(item) => String(item.id)}
        contentContainerClassName="px-5 pb-5"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
        renderItem={({ item }) => {
          const days = daysUntil(item.release_date);
          return (
            <TouchableOpacity
              className="bg-card rounded-xl mb-3 overflow-hidden flex-row"
              activeOpacity={0.7}
              onPress={() => navigation.navigate('MovieDetails', { movieId: item.id })}
            >
              {item.poster_path ? (
                <Image
                  source={{ uri: `${posterSize('w185')}${item.poster_path}` }}
                  className="w-28 h-40"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-28 h-40 bg-border items-center justify-center">
                  <Ionicons name="film-outline" size={24} color={Colors.muted} />
                </View>
              )}
              <View className="flex-1 py-4 pr-4 pl-4">
                <Text className="text-white text-base font-semibold" numberOfLines={2}>
                  {item.title}
                </Text>
                <Text className="text-muted text-sm mt-1">{item.release_date?.slice(0, 4)}</Text>

                {/* Date */}
                <View className="flex-row items-center gap-2 mt-3">
                  <Ionicons name="calendar-outline" size={16} color={Colors.muted} />
                  <Text className="text-muted text-sm">{formatDate(item.release_date)}</Text>
                </View>

                {/* Countdown pill */}
                <View className="mt-auto pt-3">
                  <View className="self-start rounded-full px-3 py-1.5 border border-primary" style={localStyles.countdownPillBg}>
                    <Text className="text-primary text-xs font-semibold">
                      {days > 0
                        ? `Releases in ${days} days`
                        : 'Releases today!'}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const localStyles = {
  countdownPillBg: { backgroundColor: Colors.primaryAlpha },
} as const;
