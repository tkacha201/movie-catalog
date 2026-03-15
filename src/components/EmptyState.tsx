import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ icon, title, subtitle, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center pb-20 px-6">
      <View className="mb-6">
        <View className="bg-card p-8 rounded-full">
          <Ionicons name={icon} size={64} color={Colors.primary} />
        </View>
      </View>
      <Text className="text-white text-xl font-semibold mb-2">{title}</Text>
      <Text className="text-muted text-center mb-8">{subtitle}</Text>
      {actionLabel && onAction && (
        <TouchableOpacity
          className="bg-primary rounded-xl py-3.5 px-8"
          activeOpacity={0.8}
          onPress={onAction}
        >
          <Text className="text-white text-base font-semibold">{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
