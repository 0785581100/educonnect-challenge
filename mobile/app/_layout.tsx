import React, { useEffect, useState } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';
import cacheManager from '@/utils/cacheManager';

// Global authentication state
let globalAuthState = {
  isAuthenticated: false,
  setIsAuthenticated: (value: boolean) => {},
  logout: async () => {
    try {
      // Clear all app cache on logout
      await cacheManager.clear();
      console.log('Cleared all cache on logout');
    } catch (error) {
      console.error('Error clearing cache on logout:', error);
    }
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const segments = useSegments();
  const router = useRouter();

  // Update global state
  globalAuthState.isAuthenticated = isAuthenticated;
  globalAuthState.setIsAuthenticated = setIsAuthenticated;

  // Function to check authentication status and preload data
  const checkAuth = async () => {
    try {
      console.log('Checking authentication status...');
      const token = await AsyncStorage.getItem('token');
      const newAuthState = !!token;
      console.log('Authentication state:', { isAuthenticated, newAuthState, hasToken: !!token });
      setIsAuthenticated(newAuthState);
      
      // If authenticated, preload common data for faster app performance
      if (newAuthState) {
        console.log('Preloading common data for authenticated user...');
        await cacheManager.preloadCommonData();
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Handle routing based on authentication
  useEffect(() => {
    if (isLoading) {
      console.log('Still loading, skipping routing logic');
      return;
    }

    console.log('Routing effect triggered:', { isAuthenticated, segments, isLoading });
    const inAuthGroup = segments[0] === 'Login' || segments[0] === 'register';
    
    // Only redirect if user is on the wrong screen type
    if (!isAuthenticated && !inAuthGroup) {
      // If not authenticated and not on auth screen, redirect to login
      console.log('User not authenticated, redirecting to login');
      router.replace('/Login');
    } else if (isAuthenticated && inAuthGroup) {
      // If authenticated and on auth screen, redirect to home
      console.log('User authenticated, redirecting to home');
      router.replace('/(tabs)');
    } else {
      console.log('No routing action needed:', { isAuthenticated, inAuthGroup });
    }
  }, [isAuthenticated, segments, isLoading, router]);

  if (!loaded || isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="Login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

// Export the global auth state for use in other components
export { globalAuthState };
