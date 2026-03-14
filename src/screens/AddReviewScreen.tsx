import React, { useState } from 'react';
import {
  View, Text, Image, ScrollView, TextInput, TouchableOpacity, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { posterSize } from '../services/apiClient';
import { useMovieStore } from '../store/movieStore';
import type { RootStackScreenProps } from '../navigation/types';

export default function AddReviewScreen({ route }: RootStackScreenProps<'AddReview'>) {
  const { movieId, movieTitle, moviePoster } = route.params;
  const navigation = useNavigation();
  const { updateMovie, addMovie, isMovieSaved } = useMovieStore();

  const existingMovie = useMovieStore((s) =>
    s.savedMovies.find((m) => m.id === String(movieId))
  );

  const [rating, setRating] = useState(existingMovie?.rating ?? 5);
  const [review, setReview] = useState(existingMovie?.review ?? '');

  const handleSave = () => {
    if (!isMovieSaved(String(movieId))) {
      addMovie({
        id: String(movieId),
        title: movieTitle,
        posterPath: moviePoster,
        releaseDate: '',
        overview: '',
      });
    }

    updateMovie(String(movieId), { rating, review });
    Alert.alert('Saved', 'Your review has been saved.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="pb-10">
      {/* Movie preview */}
      <View className="items-center py-6">
        {moviePoster ? (
          <Image
            source={{ uri: `${posterSize('w342')}${moviePoster}` }}
            className="w-40 h-60 rounded-xl"
            resizeMode="cover"
          />
        ) : (
          <View className="w-40 h-60 rounded-xl bg-card items-center justify-center">
            <Ionicons name="film-outline" size={48} color="#AAAAAA" />
          </View>
        )}
        <Text className="text-white text-xl font-semibold mt-4">{movieTitle}</Text>
      </View>

      <View className="px-4 gap-4">
        {/* Rating card */}
        <View className="bg-card rounded-xl p-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-white text-base font-semibold">Your Rating</Text>
            <View className="flex-row items-center gap-2">
              <Ionicons name="star" size={20} color="#E50914" />
              <Text className="text-white text-xl font-bold">{rating}/10</Text>
            </View>
          </View>
          <Slider
            minimumValue={1}
            maximumValue={10}
            step={1}
            value={rating}
            onValueChange={setRating}
            minimumTrackTintColor="#E50914"
            maximumTrackTintColor="#2A2A2A"
            thumbTintColor="#E50914"
          />
          <View className="flex-row justify-between mt-1">
            <Text className="text-muted text-xs">1</Text>
            <Text className="text-muted text-xs">10</Text>
          </View>
        </View>

        {/* Review text card */}
        <View className="bg-card rounded-xl p-6">
          <Text className="text-white text-base font-semibold mb-3">Your Review</Text>
          <TextInput
            className="bg-background border border-border rounded-xl text-white text-base p-4 min-h-[150px]"
            placeholder="Share your thoughts about this movie..."
            placeholderTextColor="#AAAAAA"
            multiline
            textAlignVertical="top"
            value={review}
            onChangeText={setReview}
          />
          <Text className="text-muted text-xs mt-2">{review.length} characters</Text>
        </View>

        {/* Save button */}
        <TouchableOpacity
          className="bg-primary rounded-xl py-4 items-center"
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Text className="text-white text-base font-semibold">Save Review</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
