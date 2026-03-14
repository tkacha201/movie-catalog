import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../store/authStore';
import type { AuthStackScreenProps } from '../navigation/types';

export default function LoginScreen() {
  const navigation = useNavigation<AuthStackScreenProps<'Login'>['navigation']>();
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    try {
      await login(email.trim(), password);
    } catch {
      Alert.alert('Error', 'Login failed. Please try again.');
    }
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
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        className="bg-card border border-border rounded-xl text-white text-base px-4 py-3.5 mb-4"
        placeholder="Password"
        placeholderTextColor="#AAAAAA"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
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
