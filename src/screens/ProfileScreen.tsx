import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const navigation = useNavigation();

  const handleLogout = () => {
    navigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
  };

  return (
    <View className="flex-1 bg-background items-center justify-center px-8">
      <View className="w-24 h-24 rounded-full bg-card items-center justify-center mb-4 border-2 border-border">
        <Ionicons name="person" size={48} color="#AAAAAA" />
      </View>

      <Text className="text-white text-xl font-semibold mb-1">Guest User</Text>
      <Text className="text-muted text-sm mb-10">guest@example.com</Text>

      <TouchableOpacity
        className="bg-primary rounded-xl py-3.5 px-8 flex-row items-center gap-2"
        onPress={handleLogout}
        activeOpacity={0.8}
      >
        <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
        <Text className="text-white text-base font-semibold">Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}
