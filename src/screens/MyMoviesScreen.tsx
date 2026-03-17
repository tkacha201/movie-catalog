import React, { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useMovieStore, type SavedMovie } from '../store/movieStore';
import { posterSize } from '../services/apiClient';
import { Colors } from '../theme/colors';
import EmptyState from '../components/EmptyState';

type TabKey = 'watched' | 'wishlist' | 'reviews';

const TABS: { key: TabKey; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'watched', label: 'Watched', icon: 'checkmark-circle' },
  { key: 'wishlist', label: 'Wishlist', icon: 'bookmark' },
  { key: 'reviews', label: 'Reviews', icon: 'chatbubble' },
];

const EMPTY_MESSAGES: Record<TabKey, { title: string; subtitle: string; icon: keyof typeof Ionicons.glyphMap }> = {
  watched: { title: 'No Watched Movies', subtitle: "Movies you've finished will appear here", icon: 'checkmark-circle-outline' },
  wishlist: { title: 'Empty Wishlist', subtitle: 'Save movies you want to watch later', icon: 'bookmark-outline' },
  reviews: { title: 'No Reviews Yet', subtitle: 'Rate and review movies to see them here', icon: 'chatbubble-outline' },
};

export default function MyMoviesScreen() {
  const navigation = useNavigation();
  const { savedMovies, deleteMovie, updateMovie } = useMovieStore();
  const [activeTab, setActiveTab] = useState<TabKey>('watched');

  const filteredMovies = activeTab === 'reviews'
    ? savedMovies.filter((m) => m.review.length > 0)
    : savedMovies.filter((m) => m.status === activeTab);

  const confirmDelete = (movie: SavedMovie) => {
    Alert.alert('Remove Movie', `Remove "${movie.title}" from your list?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => deleteMovie(movie.id) },
    ]);
  };

  const confirmClearReview = (movie: SavedMovie) => {
    Alert.alert('Clear Review', `Remove your review for "${movie.title}"? The movie will stay in your list.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear Review',
        style: 'destructive',
        onPress: () => updateMovie(movie.id, { rating: 0, review: '', reviewImageUri: null, recommended: false }),
      },
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
          const count = tab.key === 'reviews'
            ? savedMovies.filter((m) => m.review.length > 0).length
            : savedMovies.filter((m) => m.status === tab.key).length;
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
      ) : (
        <FlatList
          key={activeTab}
          data={filteredMovies}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerClassName="px-4 pb-5"
          columnWrapperClassName="gap-3 mb-3"
          renderItem={({ item }) => {
            const tabMeta = TABS.find((t) => t.key === activeTab);
            return (
              <TouchableOpacity
                className="flex-1 bg-card rounded-xl overflow-hidden"
                style={{ maxWidth: '49%' }}
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
                      name={tabMeta?.icon ?? 'checkmark-circle'}
                      size={14}
                      color={Colors.white}
                    />
                  </View>
                  {(activeTab === 'watched' || activeTab === 'reviews') && item.rating > 0 && (
                    <View className="absolute bottom-2 left-2 bg-black/70 rounded-lg px-2 py-1 flex-row items-center gap-1">
                      <Ionicons name="star" size={12} color={Colors.primary} />
                      <Text className="text-white text-xs font-semibold">{item.rating}/10</Text>
                    </View>
                  )}
                </View>
                <View className="p-2.5">
                  <Text className="text-white text-sm font-semibold" numberOfLines={1}>{item.title}</Text>
                  <Text className="text-muted text-xs mt-0.5">{item.releaseDate?.slice(0, 4)}</Text>
                  <TouchableOpacity
                    className="mt-2 bg-background rounded-lg py-2 flex-row items-center justify-center gap-1 border border-border"
                    onPress={() => activeTab === 'reviews' ? confirmClearReview(item) : confirmDelete(item)}
                  >
                    <Ionicons name={activeTab === 'reviews' ? 'close-circle-outline' : 'trash-outline'} size={14} color={Colors.muted} />
                    <Text className="text-muted text-xs">{activeTab === 'reviews' ? 'Clear Review' : 'Remove'}</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}
