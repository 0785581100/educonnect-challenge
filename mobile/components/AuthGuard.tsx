import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // Check if user is on an authentication screen
    const isAuthScreen = segments[0] === 'Login' || segments[0] === 'register';
    
    // If not authenticated and not on an auth screen, redirect to login
    if (!isAuthenticated && !isAuthScreen) {
      console.log('User not authenticated, redirecting to login');
      router.replace('/Login');
    }
    
    // If authenticated and on an auth screen, redirect to home
    if (isAuthenticated && isAuthScreen) {
      console.log('User authenticated, redirecting to home');
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments, isLoading, router]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  return <>{children}</>;
}
