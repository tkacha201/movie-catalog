import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useMovieStore, type SavedMovie } from '../store/movieStore';
import { posterSize } from '../services/apiClient';
import { Colors } from '../theme/colors';
import EmptyState from '../components/EmptyState';

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
        <EmptyState
          icon="film"
          title="No Movies Yet"
          subtitle="You haven't added any movies yet"
          actionLabel="Browse Movies"
          onAction={() => navigation.navigate('Main', { screen: 'Browse' })}
        />
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
          <View className="bg-card rounded-xl mb-3 overflow-hidden flex-row">
            <TouchableOpacity
              className="flex-row flex-1"
              activeOpacity={0.7}
              onPress={() => navigation.navigate('MovieDetails', { movieId: Number(item.id) })}
            >
              {item.posterPath ? (
                <Image
                  source={{ uri: `${posterSize('w185')}${item.posterPath}` }}
                  className="w-24 h-36"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-24 h-36 bg-border items-center justify-center">
                  <Ionicons name="film-outline" size={24} color={Colors.muted} />
                </View>
              )}
              <View className="flex-1 py-3 px-4">
                <Text className="text-white text-base font-semibold" numberOfLines={2}>
                  {item.title}
                </Text>
                <Text className="text-muted text-sm mt-1">
                  {item.releaseDate?.slice(0, 4)}
                </Text>
                {item.rating > 0 && (
                  <View className="flex-row items-center gap-1 mt-2">
                    <Ionicons name="star" size={14} color={Colors.primary} />
                    <Text className="text-white text-sm">{item.rating}/10</Text>
                  </View>
                )}
                {item.review ? (
                  <Text className="text-muted text-sm mt-1" numberOfLines={2}>
                    {item.review}
                  </Text>
                ) : null}

                <View className="flex-row items-center gap-4 mt-auto pt-2">
                  <TouchableOpacity
                    className="flex-row items-center gap-1"
                    onPress={() => navigation.navigate('AddReview', {
                      movieId: Number(item.id),
                      movieTitle: item.title,
                      moviePoster: item.posterPath,
                    })}
                  >
                    <Ionicons name="create-outline" size={16} color={Colors.primary} />
                    <Text className="text-primary text-sm">Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-row items-center gap-1"
                    onPress={() => confirmDelete(item)}
                  >
                    <Ionicons name="trash-outline" size={16} color={Colors.muted} />
                    <Text className="text-muted text-sm">Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
