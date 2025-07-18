import { useState, useEffect, createContext, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData: any) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
};

// Create a context for authentication
export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  checkAuth: async () => {},
});

// Provider component that wraps the app
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status
  const checkAuth = async () => {
    try {
      console.log('AuthProvider: Checking authentication status...');
      const token = await AsyncStorage.getItem('token');
      const newAuthState = !!token;
      console.log('AuthProvider: Authentication state:', { isAuthenticated, newAuthState, hasToken: !!token });
      setIsAuthenticated(newAuthState);
    } catch (error) {
      console.error('AuthProvider: Error checking authentication:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Login function
  const login = async (token: string, userData: any) => {
    try {
      console.log('AuthProvider: Logging in...');
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setIsAuthenticated(true);
      console.log('AuthProvider: Login successful');
    } catch (error) {
      console.error('AuthProvider: Error during login:', error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      console.log('AuthProvider: Logging out...');
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      setIsAuthenticated(false);
      console.log('AuthProvider: Logout successful');
    } catch (error) {
      console.error('AuthProvider: Error during logout:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
