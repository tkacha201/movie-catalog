import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { RootStackScreenProps } from '../navigation/types';

const MOVIES: Record<string, { title: string; year: number; synopsis: string }> = {
  '1': { title: 'The Shawshank Redemption', year: 1994, synopsis: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.' },
  '2': { title: 'The Dark Knight', year: 2008, synopsis: 'When the menace known as the Joker wreaks havoc on Gotham, Batman must accept one of the greatest tests.' },
  '3': { title: 'Inception', year: 2010, synopsis: 'A thief who steals corporate secrets through dream-sharing technology is given the task of planting an idea.' },
  '4': { title: 'Pulp Fiction', year: 1994, synopsis: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.' },
  '5': { title: 'The Matrix', year: 1999, synopsis: 'A hacker discovers that reality as he knows it is a simulated reality created by machines to subdue the human population.' },
  '6': { title: 'Interstellar', year: 2014, synopsis: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.' },
};

export default function MovieDetailsScreen({ route }: RootStackScreenProps<'MovieDetails'>) {
  const { movieId } = route.params;
  const movie = MOVIES[movieId];

  return (
    <View className="flex-1 bg-background px-6 pt-6">
      <View className="w-full h-52 bg-card rounded-xl items-center justify-center mb-5 border border-border">
        <Ionicons name="film-outline" size={64} color="#AAAAAA" />
      </View>

      <Text className="text-white text-2xl font-bold mb-1">
        {movie?.title ?? 'Unknown Movie'}
      </Text>
      <Text className="text-muted text-base mb-4">{movie?.year}</Text>
      <Text className="text-muted text-[15px] leading-6 mb-8">{movie?.synopsis}</Text>

      <TouchableOpacity
        className="bg-primary rounded-xl py-4 flex-row items-center justify-center gap-2"
        activeOpacity={0.8}
      >
        <Ionicons name="heart-outline" size={20} color="#FFFFFF" />
        <Text className="text-white text-base font-semibold">Add to My Movies</Text>
      </TouchableOpacity>
    </View>
  );
}
