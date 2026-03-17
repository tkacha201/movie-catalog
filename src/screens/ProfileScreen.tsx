import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/authStore';
import { useMovieStore } from '../store/movieStore';
import { Colors } from '../theme/colors';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const savedMovies = useMovieStore((s) => s.savedMovies);

  const watched = savedMovies.filter((m) => m.status === 'watched');
  const totalSaved = savedMovies.length;
  const wishlist = savedMovies.filter((m) => m.status === 'wishlist');
  const reviewed = savedMovies.filter((m) => m.review.length > 0);
  const rated = savedMovies.filter((m) => m.rating > 0);
  const avgRating = rated.length > 0
    ? (rated.reduce((sum, m) => sum + m.rating, 0) / rated.length).toFixed(1)
    : '—';

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerClassName="px-4 pt-14 pb-10">
        <Text className="text-white text-2xl font-bold mb-8">Profile</Text>

        {/* Profile Card */}
        <View className="bg-card rounded-xl p-6 mb-6">
          <View className="items-center mb-6">
            <View className="bg-primary p-6 rounded-full mb-4">
              <Ionicons name="person" size={48} color={Colors.white} />
            </View>
            <Text className="text-white text-xl font-semibold">
              {user?.username ?? 'Guest'}
            </Text>
            <Text className="text-muted text-sm mt-1">Member since Mar 2026</Text>
          </View>

          <View className="bg-background rounded-xl p-3 flex-row items-center gap-3">
            <Ionicons name="mail-outline" size={20} color={Colors.muted} />
            <View>
              <Text className="text-muted text-xs">Email</Text>
              <Text className="text-white text-base">{user?.email ?? ''}</Text>
            </View>
          </View>
        </View>

        {/* Quick Stats Grid */}
        <View className="flex-row gap-3 mb-3">
          <View className="flex-1 bg-card rounded-xl p-4">
            <View className="flex-row items-center justify-between mb-3">
              <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
              <Text className="text-primary text-2xl font-semibold">{watched.length}</Text>
            </View>
            <Text className="text-muted text-sm">Watched</Text>
          </View>
          <View className="flex-1 bg-card rounded-xl p-4">
            <View className="flex-row items-center justify-between mb-3">
              <Ionicons name="film" size={20} color={Colors.primary} />
              <Text className="text-primary text-2xl font-semibold">{totalSaved}</Text>
            </View>
            <Text className="text-muted text-sm">Total Saved</Text>
          </View>
        </View>
        <View className="flex-row gap-3 mb-6">
          <View className="flex-1 bg-card rounded-xl p-4">
            <View className="flex-row items-center justify-between mb-3">
              <Ionicons name="bookmark" size={20} color={Colors.primary} />
              <Text className="text-primary text-2xl font-semibold">{wishlist.length}</Text>
            </View>
            <Text className="text-muted text-sm">Wishlist</Text>
          </View>
          <View className="flex-1 bg-card rounded-xl p-4">
            <View className="flex-row items-center justify-between mb-3">
              <Ionicons name="chatbubble" size={20} color={Colors.primary} />
              <Text className="text-primary text-2xl font-semibold">{reviewed.length}</Text>
            </View>
            <Text className="text-muted text-sm">Reviews</Text>
          </View>
        </View>

        {/* Rating Stats */}
        <View className="bg-card rounded-xl p-6 mb-6">
          <View className="flex-row items-center gap-2 mb-4">
            <Ionicons name="star" size={20} color={Colors.primary} />
            <Text className="text-white font-semibold">Rating Stats</Text>
          </View>
          <View className="gap-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-muted">Average Rating</Text>
              <View className="flex-row items-center gap-1.5">
                <Ionicons name="star" size={14} color={Colors.primary} />
                <Text className="text-white font-semibold">{avgRating}/10</Text>
              </View>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-muted">Total Movies</Text>
              <Text className="text-white font-semibold">{savedMovies.length}</Text>
            </View>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity
          className="bg-card rounded-xl py-4 flex-row items-center justify-center gap-2 border border-primary"
          onPress={() => Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', style: 'destructive', onPress: logout },
          ])}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={20} color={Colors.primary} />
          <Text className="text-primary text-base font-semibold">Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
