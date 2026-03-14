import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/authStore';
import type { AuthStackScreenProps } from '../navigation/types';

export default function RegisterScreen() {
  const navigation = useNavigation<AuthStackScreenProps<'Register'>['navigation']>();
  const register = useAuthStore((s) => s.register);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    try {
      await register(username.trim(), email.trim(), password);
    } catch {
      Alert.alert('Error', 'Registration failed. Please try again.');
    }
  };

  return (
    <View className="flex-1 bg-background justify-center px-8">
      {/* Logo */}
      <View className="items-center mb-12">
        <View className="bg-primary p-4 rounded-2xl mb-4">
          <Ionicons name="film" size={48} color="#FFFFFF" />
        </View>
        <Text className="text-primary text-3xl font-medium">Create Account</Text>
        <Text className="text-muted text-sm mt-2">Join the community</Text>
      </View>

      {/* Form */}
      <TextInput
        className="bg-card border border-border rounded-xl text-white text-base px-4 py-3.5 mb-4"
        placeholder="Username"
        placeholderTextColor="#AAAAAA"
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
      />
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
      <TextInput
        className="bg-card border border-border rounded-xl text-white text-base px-4 py-3.5 mb-4"
        placeholder="Confirm Password"
        placeholderTextColor="#AAAAAA"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
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
          <Text className="text-primary font-semibold">Login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
