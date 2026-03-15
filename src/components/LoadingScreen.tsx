import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Colors } from '../theme/colors';

export default function LoadingScreen() {
  return (
    <View className="flex-1 bg-background items-center justify-center">
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}
