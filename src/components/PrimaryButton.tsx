import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { Colors } from '../theme/colors';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  className?: string;
}

export default function PrimaryButton({ title, onPress, loading, className }: PrimaryButtonProps) {
  return (
    <TouchableOpacity
      className={`bg-primary rounded-xl py-4 items-center ${className ?? ''}`}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color={Colors.white} />
      ) : (
        <Text className="text-white text-base font-semibold">{title}</Text>
      )}
    </TouchableOpacity>
  );
}
