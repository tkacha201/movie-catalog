import React from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Image, TextInput,
  RefreshControl, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { posterSize } from '../services/apiClient';
import { Colors } from '../theme/colors';
import { useAppNavigation } from '../hooks/useAppNavigation';
import { useMovies } from '../hooks/useMovies';
import LoadingScreen from '../components/LoadingScreen';
import ErrorScreen from '../components/ErrorScreen';

export default function BrowseScreen() {
  const navigation = useAppNavigation();
  const { movies, loading, searching, error, refreshing, query, setQuery, refresh } = useMovies();

  if (loading) return <LoadingScreen />;

  if (error && movies.length === 0) return <ErrorScreen message={error} onRetry={refresh} />;

  return (
    <View className="flex-1 bg-background">
      <View className="px-4 pt-14 pb-2">
        <Text className="text-white text-2xl font-bold mb-4">Browse Movies</Text>

        {/* Search Bar */}
        <View className="flex-row items-center bg-card border border-border rounded-xl px-4 h-12">
          <Ionicons name="search" size={20} color={Colors.muted} />
          <TextInput
            className="flex-1 text-white text-base ml-3"
            placeholder="Search movies..."
            placeholderTextColor={Colors.muted}
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={20} color={Colors.muted} />
            </TouchableOpacity>
          )}
          {searching && (
            <ActivityIndicator size="small" color={Colors.primary} className="ml-2" />
          )}
        </View>
      </View>

      <FlatList
        data={movies}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="px-3 pb-5 pt-3"
        columnWrapperClassName="gap-3 mb-3"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={Colors.primary} />
        }
        ListEmptyComponent={
          <View className="items-center py-12">
            <Text className="text-muted">No movies found</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            className="flex-1 bg-card rounded-xl overflow-hidden border border-border"
            style={{ maxWidth: '49%' }}
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
