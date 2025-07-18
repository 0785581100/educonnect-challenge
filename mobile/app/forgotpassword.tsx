import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import apiService from '@/utils/apiService';
import { useRouter } from 'expo-router';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleForgotPassword = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await apiService.post('/auth/forgot-password', { email });
      console.log('Forgot password response:', response.data);
      setSuccess('Password reset link sent! Check your email.');
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      // Detailed logging for debugging
      console.log('Full error object:', err);
      console.log('Error message:', err.message);
      console.log('Error code:', err.code);
      console.log('Error response:', err.response);
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
        errorMsg = 'Failed to send reset link. Please try again.';
      }
      console.error('Forgot password error:', err?.response?.data || err);
      setError(errorMsg);
    }
  };

  return (
    <LinearGradient colors={['#232526', '#414345']} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, justifyContent: 'center' }}>
        <View style={styles.innerContainer}>
          <Ionicons name="mail-unread" size={64} color="#fff" style={{ alignSelf: 'center', marginBottom: 16 }} />
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>Enter your email to reset your password</Text>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          {success ? <Text style={styles.success}>{success}</Text> : null}
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
          <TouchableOpacity style={styles.button} onPress={handleForgotPassword} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Send Reset Link</Text>}
          </TouchableOpacity>
          <View style={styles.registerContainer}>
            <Text style={{ color: '#fff' }}>Remembered your password?</Text>
            <TouchableOpacity onPress={() => router.push({ pathname: '/Login' })}>
              <Text style={styles.registerText}> Login</Text>
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
  success: {
    color: '#7bed9f',
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