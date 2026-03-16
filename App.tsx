import "./global.css";
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RootNavigator from './src/navigation/RootNavigator';
import { useAuthStore } from './src/store/authStore';
import { useMovieStore } from './src/store/movieStore';
import { Colors } from './src/theme/colors';
import ErrorBoundary from './src/components/ErrorBoundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

const AppTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.primary,
    background: Colors.background,
    card: Colors.card,
    text: Colors.white,
    border: Colors.border,
    notification: Colors.primary,
  },
};

export default function App() {
  const restoreSession = useAuthStore((s) => s.restoreSession);
  const user = useAuthStore((s) => s.user);
  const loadForUser = useMovieStore((s) => s.loadForUser);
  const clearForLogout = useMovieStore((s) => s.clearForLogout);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  // Load per-user movies when user changes
  useEffect(() => {
    if (user) {
      loadForUser(user.id);
    } else {
      clearForLogout();
    }
  }, [user, loadForUser, clearForLogout]);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer theme={AppTheme}>
          <StatusBar style="light" />
          <RootNavigator />
        </NavigationContainer>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
