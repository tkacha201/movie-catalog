import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface ErrorScreenProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorScreen({ message, onRetry }: ErrorScreenProps) {
  return (
    <View className="flex-1 bg-background items-center justify-center px-8">
      <Text className="text-white text-base mb-4">{message}</Text>
      {onRetry && (
        <TouchableOpacity className="bg-primary rounded-xl py-3 px-6" onPress={onRetry}>
          <Text className="text-white font-semibold">Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
