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
      await login(data.email.trim(), data.password);
    } catch (e: any) {
      Alert.alert('Login Failed', e?.message ?? 'Please try again.');
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
          <Text className="text-white text-3xl font-medium">Movie Catalog</Text>
          <Text className="text-muted text-sm mt-2">Your personal cinema</Text>
        </View>

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
          rules={{ required: 'Password is required' }}
          error={errors.password}
          placeholder="Password"
          secureTextEntry
        />

        <PrimaryButton
          title="Login"
          onPress={handleSubmit(onSubmit)}
          className="mt-2 mb-4"
        />

        {/* Demo accounts hint */}
        <View className="bg-card rounded-xl p-4 mb-6">
          <Text className="text-muted text-xs text-center mb-1">Demo accounts (password: password)</Text>
          <Text className="text-white text-xs text-center">alice@demo.com  ·  bob@demo.com  ·  charlie@demo.com</Text>
        </View>

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
