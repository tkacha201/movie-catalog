import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const UPCOMING = [
  { id: '1', title: 'Dune: Part Three', date: 'Dec 2026' },
  { id: '2', title: 'Avatar 3', date: 'Dec 2025' },
  { id: '3', title: 'The Batman Part II', date: 'Oct 2027' },
];

export default function UpcomingScreen() {
  return (
    <View className="flex-1 bg-background">
      <Text className="text-white text-2xl font-bold px-5 pt-14 pb-4">
        Upcoming
      </Text>
      <FlatList
        data={UPCOMING}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-5 pb-5"
        renderItem={({ item }) => (
          <View className="flex-row items-center gap-4 bg-card rounded-xl p-4 mb-3 border border-border">
            <Ionicons name="calendar-outline" size={24} color="#E50914" />
            <View className="flex-1">
              <Text className="text-white text-base font-semibold">{item.title}</Text>
              <Text className="text-muted text-sm mt-1">{item.date}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}
