import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { AuthStackScreenProps } from '../navigation/types';

export default function RegisterScreen() {
  const navigation = useNavigation<AuthStackScreenProps<'Register'>['navigation']>();

  const handleRegister = () => {
    navigation.getParent()?.reset({ index: 0, routes: [{ name: 'Main' }] });
  };

  return (
    <View className="flex-1 bg-background justify-center px-8">
      <Text className="text-primary text-3xl font-bold text-center mb-2">
        Create Account
      </Text>
      <Text className="text-muted text-base text-center mb-8">
        Join Movie Catalog
      </Text>

      <TextInput
        className="bg-card border border-border rounded-xl text-white text-base px-4 py-3.5 mb-4"
        placeholder="Full Name"
        placeholderTextColor="#AAAAAA"
        autoCapitalize="words"
      />
      <TextInput
        className="bg-card border border-border rounded-xl text-white text-base px-4 py-3.5 mb-4"
        placeholder="Email"
        placeholderTextColor="#AAAAAA"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        className="bg-card border border-border rounded-xl text-white text-base px-4 py-3.5 mb-4"
        placeholder="Password"
        placeholderTextColor="#AAAAAA"
        secureTextEntry
      />

      <TouchableOpacity
        className="bg-primary rounded-xl py-4 items-center mt-2 mb-6"
        onPress={handleRegister}
        activeOpacity={0.8}
      >
        <Text className="text-white text-base font-semibold">Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
        <Text className="text-muted text-sm text-center">
          Already have an account?{' '}
          <Text className="text-primary font-semibold">Log In</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
