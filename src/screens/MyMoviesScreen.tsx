import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useMovieStore, type SavedMovie } from '../store/movieStore';
import { posterSize } from '../services/apiClient';

export default function MyMoviesScreen() {
  const navigation = useNavigation();
  const { savedMovies, deleteMovie } = useMovieStore();

  const confirmDelete = (movie: SavedMovie) => {
    Alert.alert('Remove Movie', `Remove "${movie.title}" from your list?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => deleteMovie(movie.id) },
    ]);
  };

  if (savedMovies.length === 0) {
    return (
      <View className="flex-1 bg-background">
        <Text className="text-white text-2xl font-bold px-5 pt-14 pb-4">
          My Movies
        </Text>
        <View className="flex-1 items-center justify-center pb-20">
          <Ionicons name="heart-outline" size={48} color="#AAAAAA" />
          <Text className="text-white text-lg font-semibold mt-4">
            No movies saved yet
          </Text>
          <Text className="text-muted text-sm mt-2">
            Browse movies and add them to your list
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <Text className="text-white text-2xl font-bold px-5 pt-14 pb-4">
        My Movies
      </Text>
      <FlatList
        data={savedMovies}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-5 pb-5"
        renderItem={({ item }) => (
          <TouchableOpacity
            className="flex-row bg-card rounded-xl mb-3 border border-border overflow-hidden"
            activeOpacity={0.7}
            onPress={() => navigation.navigate('MovieDetails', { movieId: Number(item.id) })}
          >
            {item.posterPath ? (
              <Image
                source={{ uri: `${posterSize('w185')}${item.posterPath}` }}
                className="w-20 h-28"
                resizeMode="cover"
              />
            ) : (
              <View className="w-20 h-28 bg-border items-center justify-center">
                <Ionicons name="film-outline" size={24} color="#AAAAAA" />
              </View>
            )}
            <View className="flex-1 py-3 px-4 justify-center">
              <Text className="text-white text-base font-semibold" numberOfLines={2}>
                {item.title}
              </Text>
              <Text className="text-muted text-sm mt-1">
                {item.releaseDate?.slice(0, 4)}
              </Text>
              {item.rating > 0 && (
                <View className="flex-row items-center gap-1 mt-1">
                  <Ionicons name="star" size={12} color="#E50914" />
                  <Text className="text-primary text-xs font-semibold">
                    Your rating: {item.rating}/10
                  </Text>
                </View>
              )}
            </View>
            <TouchableOpacity
              className="px-4 items-center justify-center"
              onPress={() => confirmDelete(item)}
              activeOpacity={0.6}
            >
              <Ionicons name="trash-outline" size={20} color="#E50914" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
