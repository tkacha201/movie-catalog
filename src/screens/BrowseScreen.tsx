import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SAMPLE_MOVIES = [
  { id: '1', title: 'The Shawshank Redemption', year: 1994 },
  { id: '2', title: 'The Dark Knight', year: 2008 },
  { id: '3', title: 'Inception', year: 2010 },
  { id: '4', title: 'Pulp Fiction', year: 1994 },
  { id: '5', title: 'The Matrix', year: 1999 },
  { id: '6', title: 'Interstellar', year: 2014 },
];

export default function BrowseScreen() {
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-background">
      <Text className="text-white text-2xl font-bold px-5 pt-14 pb-4">
        Browse Movies
      </Text>
      <FlatList
        data={SAMPLE_MOVIES}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-5 pb-5"
        renderItem={({ item }) => (
          <TouchableOpacity
            className="bg-card rounded-xl p-4 mb-3 border border-border"
            activeOpacity={0.7}
            onPress={() => navigation.navigate('MovieDetails', { movieId: item.id })}
          >
            <Text className="text-white text-base font-semibold">{item.title}</Text>
            <Text className="text-muted text-sm mt-1">{item.year}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
