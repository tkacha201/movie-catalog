import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { AuthStackScreenProps } from '../navigation/types';

export default function LoginScreen() {
  const navigation = useNavigation<AuthStackScreenProps<'Login'>['navigation']>();

  const handleLogin = () => {
    navigation.getParent()?.reset({ index: 0, routes: [{ name: 'Main' }] });
  };

  return (
    <View className="flex-1 bg-background justify-center px-8">
      <Text className="text-primary text-3xl font-bold text-center mb-2">
        Movie Catalog
      </Text>
      <Text className="text-muted text-base text-center mb-8">
        Sign in to continue
      </Text>

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
        onPress={handleLogin}
        activeOpacity={0.8}
      >
        <Text className="text-white text-base font-semibold">Log In</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')} activeOpacity={0.7}>
        <Text className="text-muted text-sm text-center">
          Don't have an account?{' '}
          <Text className="text-primary font-semibold">Register</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
