import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function MyMoviesScreen() {
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
