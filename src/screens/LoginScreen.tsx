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

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginScreen() {
  const navigation = useNavigation<AuthStackScreenProps<'Login'>['navigation']>();
  const login = useAuthStore((s) => s.login);

  const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email.trim() || 'guest@example.com', data.password || 'password');
    } catch {
      Alert.alert('Error', 'Login failed. Please try again.');
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
          <Text className="text-white text-3xl font-medium">Movie Catalog</Text>
          <Text className="text-muted text-sm mt-2">Your personal cinema</Text>
        </View>

        {/* Email */}
        <Controller
          control={control}
          name="email"
          rules={{
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
          render={({ field: { onChange, value } }) => (
            <View className="mb-4">
              <TextInput
                className="bg-card border border-border rounded-xl text-white text-base px-4 py-3.5"
                placeholder="Password"
                placeholderTextColor="#AAAAAA"
                secureTextEntry
                value={value}
                onChangeText={onChange}
              />
            </View>
          )}
        />

        <TouchableOpacity
          className="bg-primary rounded-xl py-4 items-center mt-2 mb-6"
          onPress={handleSubmit(onSubmit)}
          activeOpacity={0.8}
        >
          <Text className="text-white text-base font-semibold">Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')} activeOpacity={0.7}>
          <Text className="text-muted text-sm text-center">
            Don't have an account?{' '}
            <Text className="text-primary font-semibold">Create one</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
