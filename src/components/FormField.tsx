import React from 'react';
import { View, Text, TextInput, type TextInputProps } from 'react-native';
import { Controller, type Control } from 'react-hook-form';
import { Colors } from '../theme/colors';

interface FormFieldProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  control: Control<any>;
  name: string;
  rules?: Record<string, any>;
  error?: { message?: string };
}

export default function FormField({
  control,
  name,
  rules,
  error,
  ...textInputProps
}: FormFieldProps) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value } }) => (
        <View className="mb-4">
          <TextInput
            className={`bg-card border rounded-xl text-white text-base px-4 py-3.5 ${
              error ? 'border-primary' : 'border-border'
            }`}
            placeholderTextColor={Colors.muted}
            value={value}
            onChangeText={onChange}
            {...textInputProps}
          />
          {error?.message && (
            <Text className="text-primary text-xs mt-1">{error.message}</Text>
          )}
        </View>
      )}
    />
  );
}
