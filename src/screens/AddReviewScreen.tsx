import React, { useState } from 'react';
import {
  View, Text, Image, TextInput, TouchableOpacity, Alert, Switch,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import * as ImagePicker from 'expo-image-picker';
import { posterSize } from '../services/apiClient';
import { useMovieStore } from '../store/movieStore';
import type { RootStackScreenProps } from '../navigation/types';
import { Colors } from '../theme/colors';
import PrimaryButton from '../components/PrimaryButton';

interface ReviewForm {
  review: string;
}

export default function AddReviewScreen({ route }: RootStackScreenProps<'AddReview'>) {
  const { movieId, movieTitle, moviePoster } = route.params;
  const navigation = useNavigation();
  const { updateMovie, addMovie, isMovieSaved } = useMovieStore();

  const existingMovie = useMovieStore((s) =>
    s.savedMovies.find((m) => m.id === String(movieId))
  );

  const [rating, setRating] = useState(existingMovie?.rating ?? 5);
  const [recommended, setRecommended] = useState(existingMovie?.recommended ?? true);
  const [imageUri, setImageUri] = useState<string | null>(existingMovie?.reviewImageUri ?? null);

  const { control, handleSubmit, formState: { errors } } = useForm<ReviewForm>({
    defaultValues: { review: existingMovie?.review ?? '' },
  });

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow access to your photo library.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow access to your camera.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const showImageOptions = () => {
    Alert.alert('Add Image', 'Choose a source', [
      { text: 'Camera', onPress: takePhoto },
      { text: 'Photo Library', onPress: pickImage },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const onSubmit = (data: ReviewForm) => {
    if (!isMovieSaved(String(movieId))) {
      addMovie({
        id: String(movieId),
        title: movieTitle,
        posterPath: moviePoster,
        releaseDate: '',
        overview: '',
      });
    }

    updateMovie(String(movieId), {
      rating,
      review: data.review,
      reviewImageUri: imageUri,
      recommended,
    });

    Alert.alert('Saved', 'Your review has been saved.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-10"
        keyboardShouldPersistTaps="handled"
      >
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
              <Ionicons name="film-outline" size={48} color={Colors.muted} />
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
                <Ionicons name="star" size={20} color={Colors.primary} />
                <Text className="text-white text-xl font-bold">{rating}/10</Text>
              </View>
            </View>
            <Slider
              minimumValue={1}
              maximumValue={10}
              step={1}
              value={rating}
              onValueChange={setRating}
              minimumTrackTintColor={Colors.primary}
              maximumTrackTintColor={Colors.border}
              thumbTintColor={Colors.primary}
            />
            <View className="flex-row justify-between mt-1">
              <Text className="text-muted text-xs">1</Text>
              <Text className="text-muted text-xs">10</Text>
            </View>
          </View>

          {/* Review text card */}
          <View className="bg-card rounded-xl p-6">
            <Text className="text-white text-base font-semibold mb-3">Your Review</Text>
            <Controller
              control={control}
              name="review"
              rules={{
                required: 'Please write a review',
                minLength: { value: 10, message: 'Review must be at least 10 characters' },
              }}
              render={({ field: { onChange, value } }) => (
                <>
                  <TextInput
                    className={`bg-background border rounded-xl text-white text-base p-4 min-h-[150px] ${
                      errors.review ? 'border-primary' : 'border-border'
                    }`}
                    placeholder="Share your thoughts about this movie..."
                    placeholderTextColor={Colors.muted}
                    multiline
                    textAlignVertical="top"
                    value={value}
                    onChangeText={onChange}
                  />
                  <View className="flex-row justify-between mt-2">
                    <Text className="text-muted text-xs">{value.length} characters</Text>
                    {errors.review && (
                      <Text className="text-primary text-xs">{errors.review.message}</Text>
                    )}
                  </View>
                </>
              )}
            />
          </View>

          {/* Recommend toggle */}
          <View className="bg-card rounded-xl p-6 flex-row items-center justify-between">
            <View>
              <Text className="text-white text-base font-semibold">Recommend this movie?</Text>
              <Text className="text-muted text-sm mt-1">
                {recommended ? 'You recommend this' : 'Not recommended'}
              </Text>
            </View>
            <Switch
              value={recommended}
              onValueChange={setRecommended}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor={Colors.white}
            />
          </View>

          {/* Image picker card */}
          <View className="bg-card rounded-xl p-6">
            <Text className="text-white text-base font-semibold mb-3">Add Image (Optional)</Text>
            {imageUri ? (
              <View>
                <Image
                  source={{ uri: imageUri }}
                  className="w-full h-40 rounded-xl"
                  resizeMode="cover"
                />
                <TouchableOpacity
                  className="absolute top-2 right-2 bg-black/70 rounded-lg px-3 py-1"
                  onPress={() => setImageUri(null)}
                >
                  <Text className="text-white text-sm">Remove</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                className="w-full h-32 border-2 border-dashed border-border rounded-xl items-center justify-center"
                onPress={showImageOptions}
                activeOpacity={0.7}
              >
                <Ionicons name="cloud-upload-outline" size={32} color={Colors.muted} />
                <Text className="text-muted mt-2">Upload Image</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Save button */}
          <PrimaryButton title="Save Review" onPress={handleSubmit(onSubmit)} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
