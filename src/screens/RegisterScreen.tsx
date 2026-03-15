import React from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Alert,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/authStore';
import type { AuthStackScreenProps } from '../navigation/types';

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterScreen() {
  const navigation = useNavigation<AuthStackScreenProps<'Register'>['navigation']>();
  const register = useAuthStore((s) => s.register);

  const { control, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>({
    defaultValues: { username: '', email: '', password: '', confirmPassword: '' },
  });

  const password = watch('password');

  const onSubmit = async (data: RegisterForm) => {
    try {
      await register(data.username.trim(), data.email.trim(), data.password);
    } catch {
      Alert.alert('Error', 'Registration failed. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerClassName="flex-1 justify-center px-8"
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View className="items-center mb-12">
          <View className="bg-primary p-4 rounded-2xl mb-4">
            <Ionicons name="film" size={48} color="#FFFFFF" />
          </View>
          <Text className="text-primary text-3xl font-medium">Create Account</Text>
          <Text className="text-muted text-sm mt-2">Join the community</Text>
        </View>

        {/* Username */}
        <Controller
          control={control}
          name="username"
          rules={{ required: 'Username is required' }}
          render={({ field: { onChange, value } }) => (
            <View className="mb-4">
              <TextInput
                className={`bg-card border rounded-xl text-white text-base px-4 py-3.5 ${
                  errors.username ? 'border-primary' : 'border-border'
                }`}
                placeholder="Username"
                placeholderTextColor="#AAAAAA"
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
              />
              {errors.username && (
                <Text className="text-primary text-xs mt-1">{errors.username.message}</Text>
              )}
            </View>
          )}
        />

        {/* Email */}
        <Controller
          control={control}
          name="email"
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Enter a valid email address',
            },
          }}
          render={({ field: { onChange, value } }) => (
            <View className="mb-4">
              <TextInput
                className={`bg-card border rounded-xl text-white text-base px-4 py-3.5 ${
                  errors.email ? 'border-primary' : 'border-border'
                }`}
                placeholder="Email"
                placeholderTextColor="#AAAAAA"
                keyboardType="email-address"
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
              />
              {errors.email && (
                <Text className="text-primary text-xs mt-1">{errors.email.message}</Text>
              )}
            </View>
          )}
        />

        {/* Password */}
        <Controller
          control={control}
          name="password"
          rules={{
            required: 'Password is required',
            minLength: { value: 6, message: 'Password must be at least 6 characters' },
          }}
          render={({ field: { onChange, value } }) => (
            <View className="mb-4">
              <TextInput
                className={`bg-card border rounded-xl text-white text-base px-4 py-3.5 ${
                  errors.password ? 'border-primary' : 'border-border'
                }`}
                placeholder="Password"
                placeholderTextColor="#AAAAAA"
                secureTextEntry
                value={value}
                onChangeText={onChange}
              />
              {errors.password && (
                <Text className="text-primary text-xs mt-1">{errors.password.message}</Text>
              )}
            </View>
          )}
        />

        {/* Confirm Password */}
        <Controller
          control={control}
          name="confirmPassword"
          rules={{
            required: 'Please confirm your password',
            validate: (val) => val === password || 'Passwords do not match',
          }}
          render={({ field: { onChange, value } }) => (
            <View className="mb-4">
              <TextInput
                className={`bg-card border rounded-xl text-white text-base px-4 py-3.5 ${
                  errors.confirmPassword ? 'border-primary' : 'border-border'
                }`}
                placeholder="Confirm Password"
                placeholderTextColor="#AAAAAA"
                secureTextEntry
                value={value}
                onChangeText={onChange}
              />
              {errors.confirmPassword && (
                <Text className="text-primary text-xs mt-1">{errors.confirmPassword.message}</Text>
              )}
            </View>
          )}
        />

        <TouchableOpacity
          className="bg-primary rounded-xl py-4 items-center mt-2 mb-6"
          onPress={handleSubmit(onSubmit)}
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
