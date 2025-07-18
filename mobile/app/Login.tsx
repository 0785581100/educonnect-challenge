import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from '@/utils/apiService';
import { useRouter } from 'expo-router';
import { globalAuthState } from './_layout';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Attempting login with email:', email);
      const response = await apiService.post('/auth/login', { email, password });
      console.log('Login response:', response.data);
      
      // Store token and user data
      console.log('Storing token and user data...');
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      console.log('Token and user data stored successfully');
      
      // Update global authentication state immediately
      globalAuthState.setIsAuthenticated(true);
      console.log('Global authentication state updated to true');
      
      // Set loading to false
      setLoading(false);
      
      // Navigate to home screen
      console.log('Navigating to home immediately');
      router.replace('/(tabs)');
    } catch (err: any) {
      console.error('Login error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: err.config
      });
      setLoading(false);
      let errorMsg = '';
      if (!err.response) {
        errorMsg = 'Unable to connect. Please check your internet connection or try again later.';
      } else if (err?.response?.data?.errors) {
        errorMsg = Object.entries(err.response.data.errors)
          .map(([field, msgs]) => `${capitalize(field)}: ${(msgs as string[])[0]}`)
          .join('\n');
      } else if (err?.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else {
        errorMsg = 'Login failed. Please try again.';
      }
      console.error('Login error:', err?.response?.data || err);
      setError(errorMsg);
    }
  };

  return (
    <LinearGradient colors={['#0f2027', '#2c5364']} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, justifyContent: 'center' }}>
        <View style={styles.innerContainer}>
          <Ionicons name="planet" size={64} color="#fff" style={{ alignSelf: 'center', marginBottom: 16 }} />
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to EduConnect</Text>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <View style={styles.inputContainer}>
            <Ionicons name="mail" size={20} color="#aaa" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#aaa"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed" size={20} color="#aaa" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#aaa"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
          {/* Forgot password functionality removed */}
          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
          </TouchableOpacity>
          <View style={styles.registerContainer}>
            <Text style={{ color: '#fff' }}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={styles.registerText}> Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    margin: 24,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.8,
  },
  error: {
    color: '#ff6b6b',
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: '#fff',
    height: 48,
    fontSize: 16,
  },
  // Forgot password styles removed
  button: {
    backgroundColor: '#1e90ff',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#1e90ff',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  registerText: {
    color: '#7ed6df',
    fontWeight: 'bold',
  },
});

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
} 