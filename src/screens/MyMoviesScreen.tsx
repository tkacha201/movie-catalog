import React, { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useMovieStore, type SavedMovie, type MovieStatus } from '../store/movieStore';
import { posterSize } from '../services/apiClient';
import { Colors } from '../theme/colors';
import EmptyState from '../components/EmptyState';

const TABS: { key: MovieStatus; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'watched', label: 'Watched', icon: 'checkmark-circle' },
  { key: 'watching', label: 'Watching', icon: 'eye' },
  { key: 'wishlist', label: 'Wishlist', icon: 'bookmark' },
];

const EMPTY_MESSAGES: Record<MovieStatus, { title: string; subtitle: string; icon: keyof typeof Ionicons.glyphMap }> = {
  watched: { title: 'No Watched Movies', subtitle: "Movies you've finished will appear here", icon: 'checkmark-circle-outline' },
  watching: { title: 'Not Watching Anything', subtitle: "Track shows you're currently following", icon: 'eye-outline' },
  wishlist: { title: 'Empty Wishlist', subtitle: 'Save movies you want to watch later', icon: 'bookmark-outline' },
};

export default function MyMoviesScreen() {
  const navigation = useNavigation();
  const { savedMovies, deleteMovie } = useMovieStore();
  const [activeTab, setActiveTab] = useState<MovieStatus>('watched');

  const filteredMovies = savedMovies.filter((m) => m.status === activeTab);

  const confirmDelete = (movie: SavedMovie) => {
    Alert.alert('Remove Movie', `Remove "${movie.title}" from your list?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => deleteMovie(movie.id) },
    ]);
  };

  const empty = EMPTY_MESSAGES[activeTab];

  return (
    <View className="flex-1 bg-background">
      <Text className="text-white text-2xl font-bold px-5 pt-14 pb-4">
        My Movies
      </Text>

      {/* Tabs */}
      <View className="flex-row px-5 gap-2 mb-4">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const count = savedMovies.filter((m) => m.status === tab.key).length;
          return (
            <TouchableOpacity
              key={tab.key}
              className={`flex-row items-center gap-1.5 px-4 py-2.5 rounded-xl ${
                isActive ? 'bg-primary' : 'bg-card'
              }`}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.7}
            >
              <Ionicons name={tab.icon} size={16} color={isActive ? Colors.white : Colors.muted} />
              <Text className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-muted'}`}>
                {tab.label}
              </Text>
              {count > 0 && (
                <View className={`rounded-full px-1.5 min-w-[20px] items-center ${isActive ? 'bg-white/20' : 'bg-border'}`}>
                  <Text className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-muted'}`}>{count}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {filteredMovies.length === 0 ? (
        <EmptyState
          icon={empty.icon}
          title={empty.title}
          subtitle={empty.subtitle}
          actionLabel="Browse Movies"
          onAction={() => navigation.navigate('Main', { screen: 'Browse' })}
        />
      ) : activeTab === 'watched' ? (
        /* Watched — list view with review info */
        <FlatList
          data={filteredMovies}
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
                        movieReleaseDate: item.releaseDate,
                        movieOverview: item.overview,
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
      ) : (
        /* Watching / Wishlist — 2-column grid */
        <FlatList
          key={activeTab}
          data={filteredMovies}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerClassName="px-4 pb-5"
          columnWrapperClassName="gap-3 mb-3"
          renderItem={({ item }) => (
            <TouchableOpacity
              className="flex-1 bg-card rounded-xl overflow-hidden"
              activeOpacity={0.7}
              onPress={() => navigation.navigate('MovieDetails', { movieId: Number(item.id) })}
            >
              <View className="relative">
                {item.posterPath ? (
                  <Image
                    source={{ uri: `${posterSize('w342')}${item.posterPath}` }}
                    className="w-full aspect-[2/3]"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="w-full aspect-[2/3] bg-border items-center justify-center">
                    <Ionicons name="film-outline" size={32} color={Colors.muted} />
                  </View>
                )}
                <View className="absolute top-2 right-2 bg-primary p-1.5 rounded-full">
                  <Ionicons
                    name={activeTab === 'watching' ? 'eye' : 'bookmark'}
                    size={14}
                    color={Colors.white}
                  />
                </View>
              </View>
              <View className="p-2.5">
                <Text className="text-white text-sm font-semibold" numberOfLines={1}>{item.title}</Text>
                <Text className="text-muted text-xs mt-0.5">{item.releaseDate?.slice(0, 4)}</Text>
                <TouchableOpacity
                  className="mt-2 bg-background rounded-lg py-2 flex-row items-center justify-center gap-1 border border-border"
                  onPress={() => confirmDelete(item)}
                >
                  <Ionicons name="trash-outline" size={14} color={Colors.muted} />
                  <Text className="text-muted text-xs">Remove</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
