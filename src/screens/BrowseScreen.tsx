import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Image, TextInput,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { discoverMovies, searchMovies, type TMDBMovie } from '../services/movieService';
import { posterSize } from '../services/apiClient';

export default function BrowseScreen() {
  const navigation = useNavigation();
  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const fetchMovies = useCallback(async (searchQuery?: string) => {
    try {
      setError(null);
      const data = searchQuery?.trim()
        ? await searchMovies(searchQuery.trim())
        : await discoverMovies();
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

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!loading) fetchMovies(query);
    }, 500);
    return () => clearTimeout(timeout);
  }, [query, fetchMovies, loading]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchMovies(query);
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
        <TouchableOpacity className="bg-primary rounded-xl py-3 px-6" onPress={() => fetchMovies(query)}>
          <Text className="text-white font-semibold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <View className="px-4 pt-14 pb-2">
        <Text className="text-white text-2xl font-bold mb-4">Browse Movies</Text>

        {/* Search Bar */}
        <View className="flex-row items-center bg-card border border-border rounded-xl px-4 h-12">
          <Ionicons name="search" size={20} color="#AAAAAA" />
          <TextInput
            className="flex-1 text-white text-base ml-3"
            placeholder="Search movies..."
            placeholderTextColor="#AAAAAA"
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={20} color="#AAAAAA" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={movies}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        contentContainerClassName="px-3 pb-5 pt-3"
        columnWrapperClassName="gap-3 mb-3"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E50914" />
        }
        ListEmptyComponent={
          <View className="items-center py-12">
            <Text className="text-muted">No movies found</Text>
          </View>
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
