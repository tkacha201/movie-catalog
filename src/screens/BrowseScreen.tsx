import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Image,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { discoverMovies, type TMDBMovie } from '../services/movieService';
import { posterSize } from '../services/apiClient';

export default function BrowseScreen() {
  const navigation = useNavigation();
  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMovies = useCallback(async () => {
    try {
      setError(null);
      const data = await discoverMovies();
      setMovies(data.results);
    } catch {
      setError('Failed to load movies.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchMovies();
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
        <TouchableOpacity className="bg-primary rounded-xl py-3 px-6" onPress={fetchMovies}>
          <Text className="text-white font-semibold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <Text className="text-white text-2xl font-bold px-5 pt-14 pb-4">
        Browse Movies
      </Text>
      <FlatList
        data={movies}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        contentContainerClassName="px-3 pb-5"
        columnWrapperClassName="gap-3 mb-3"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E50914" />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            className="flex-1 bg-card rounded-xl overflow-hidden border border-border"
            activeOpacity={0.7}
            onPress={() => navigation.navigate('MovieDetails', { movieId: item.id })}
          >
            {item.poster_path ? (
              <Image
                source={{ uri: `${posterSize('w342')}${item.poster_path}` }}
                className="w-full aspect-[2/3]"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full aspect-[2/3] bg-border items-center justify-center">
                <Text className="text-muted text-xs">No Image</Text>
              </View>
            )}
            <View className="p-2.5">
              <Text className="text-white text-sm font-semibold" numberOfLines={1}>
                {item.title}
              </Text>
              <Text className="text-muted text-xs mt-0.5">
                {item.release_date?.slice(0, 4)}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
