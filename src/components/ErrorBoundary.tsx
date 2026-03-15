import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  private handleRestart = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View className="flex-1 bg-background items-center justify-center px-8">
          <View className="bg-card p-8 rounded-full mb-6">
            <Ionicons name="warning-outline" size={64} color={Colors.primary} />
          </View>
          <Text className="text-white text-xl font-semibold mb-2">Something went wrong</Text>
          <Text className="text-muted text-center mb-8">
            An unexpected error occurred. Please try again.
          </Text>
          <TouchableOpacity
            className="bg-primary rounded-xl py-3.5 px-8"
            activeOpacity={0.8}
            onPress={this.handleRestart}
          >
            <Text className="text-white text-base font-semibold">Restart</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}
