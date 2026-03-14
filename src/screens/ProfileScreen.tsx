import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/authStore';
import { useMovieStore } from '../store/movieStore';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const savedCount = useMovieStore((s) => s.savedMovies.length);

  return (
    <View className="flex-1 bg-background items-center justify-center px-8">
      <View className="w-24 h-24 rounded-full bg-card items-center justify-center mb-4 border-2 border-border">
        <Ionicons name="person" size={48} color="#AAAAAA" />
      </View>

      <Text className="text-white text-xl font-semibold mb-1">
        {user?.name ?? 'Guest'}
      </Text>
      <Text className="text-muted text-sm mb-6">{user?.email ?? ''}</Text>

      <View className="bg-card rounded-xl px-8 py-4 mb-10 border border-border items-center">
        <Text className="text-white text-2xl font-bold">{savedCount}</Text>
        <Text className="text-muted text-sm mt-1">Saved Movies</Text>
      </View>

      <TouchableOpacity
        className="bg-primary rounded-xl py-3.5 px-8 flex-row items-center gap-2"
        onPress={logout}
        activeOpacity={0.8}
      >
        <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
        <Text className="text-white text-base font-semibold">Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}
