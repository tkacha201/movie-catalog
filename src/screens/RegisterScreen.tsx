import React from 'react';
import {
  View, Text, TouchableOpacity, Alert,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/authStore';
import type { AuthStackScreenProps } from '../navigation/types';
import { Colors } from '../theme/colors';
import FormField from '../components/FormField';
import PrimaryButton from '../components/PrimaryButton';

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
    } catch (e: any) {
      Alert.alert('Registration Failed', e?.message ?? 'Please try again.');
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
            <Ionicons name="film" size={48} color={Colors.white} />
          </View>
          <Text className="text-primary text-3xl font-medium">Create Account</Text>
          <Text className="text-muted text-sm mt-2">Join the community</Text>
        </View>

        {/* Username */}
        <FormField
          control={control}
          name="username"
          rules={{ required: 'Username is required' }}
          error={errors.username}
          placeholder="Username"
          autoCapitalize="none"
        />

        {/* Email */}
        <FormField
          control={control}
          name="email"
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Enter a valid email address',
            },
          }}
          error={errors.email}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Password */}
        <FormField
          control={control}
          name="password"
          rules={{
            required: 'Password is required',
            minLength: { value: 6, message: 'Password must be at least 6 characters' },
          }}
          error={errors.password}
          placeholder="Password"
          secureTextEntry
        />

        {/* Confirm Password */}
        <FormField
          control={control}
          name="confirmPassword"
          rules={{
            required: 'Please confirm your password',
            validate: (val: string) => val === password || 'Passwords do not match',
          }}
          error={errors.confirmPassword}
          placeholder="Confirm Password"
          secureTextEntry
        />

        <PrimaryButton
          title="Register"
          onPress={handleSubmit(onSubmit)}
          className="mt-2 mb-6"
        />

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
