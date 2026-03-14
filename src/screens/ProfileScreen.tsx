import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/authStore';
import { useMovieStore } from '../store/movieStore';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const savedCount = useMovieStore((s) => s.savedMovies.length);

  return (
    <View className="flex-1 bg-background">
      <View className="px-4 pt-14 pb-6">
        <Text className="text-white text-2xl font-bold mb-8">Profile</Text>

        {/* Profile Card */}
        <View className="bg-card rounded-xl p-6 mb-6">
          <View className="items-center mb-6">
            <View className="bg-primary p-6 rounded-full mb-4">
              <Ionicons name="person" size={48} color="#FFFFFF" />
            </View>
            <Text className="text-white text-xl font-semibold">
              {user?.username ?? 'Guest'}
            </Text>
          </View>

          <View className="bg-background rounded-xl p-3 flex-row items-center gap-3">
            <Ionicons name="mail-outline" size={20} color="#AAAAAA" />
            <View>
              <Text className="text-muted text-xs">Email</Text>
              <Text className="text-white text-base">{user?.email ?? ''}</Text>
            </View>
          </View>
        </View>

        {/* Saved Movies Card */}
        <View className="bg-card rounded-xl p-6 mb-6">
          <Text className="text-white text-base font-semibold mb-3">Your Movies</Text>
          <View className="flex-row items-center gap-3">
            <Ionicons name="film" size={20} color="#E50914" />
            <Text className="text-white text-base">
              {savedCount} {savedCount === 1 ? 'movie' : 'movies'} saved
            </Text>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity
          className="bg-card rounded-xl py-4 flex-row items-center justify-center gap-2 border border-primary"
          onPress={logout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={20} color="#E50914" />
          <Text className="text-primary text-base font-semibold">Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
