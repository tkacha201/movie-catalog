import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, Image, TouchableOpacity,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getUpcomingMovies, type TMDBMovie } from '../services/movieService';
import { posterSize } from '../services/apiClient';

function daysUntil(dateStr: string): number {
  const release = new Date(dateStr);
  const now = new Date();
  const diff = release.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default function UpcomingScreen() {
  const navigation = useNavigation();
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

  if (loading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-8">
        <Text className="text-white text-base mb-4">{error}</Text>
        <TouchableOpacity className="bg-primary rounded-xl py-3 px-6" onPress={fetchUpcoming}>
          <Text className="text-white font-semibold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <Text className="text-white text-2xl font-bold px-5 pt-14 pb-4">
        Upcoming
      </Text>
      <FlatList
        data={movies}
        keyExtractor={(item) => String(item.id)}
        contentContainerClassName="px-5 pb-5"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E50914" />
        }
        renderItem={({ item }) => {
          const days = daysUntil(item.release_date);
          return (
            <TouchableOpacity
              className="flex-row items-center gap-4 bg-card rounded-xl mb-3 border border-border overflow-hidden"
              activeOpacity={0.7}
              onPress={() => navigation.navigate('MovieDetails', { movieId: item.id })}
            >
              {item.poster_path ? (
                <Image
                  source={{ uri: `${posterSize('w185')}${item.poster_path}` }}
                  className="w-20 h-28"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-20 h-28 bg-border items-center justify-center">
                  <Ionicons name="film-outline" size={24} color="#AAAAAA" />
                </View>
              )}
              <View className="flex-1 py-3 pr-4">
                <Text className="text-white text-base font-semibold" numberOfLines={2}>
                  {item.title}
                </Text>
                <Text className="text-muted text-sm mt-1">{item.release_date}</Text>
                {days > 0 && (
                  <View className="flex-row items-center gap-1 mt-1.5">
                    <Ionicons name="time-outline" size={14} color="#E50914" />
                    <Text className="text-primary text-xs font-semibold">
                      {days} day{days !== 1 ? 's' : ''} away
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
