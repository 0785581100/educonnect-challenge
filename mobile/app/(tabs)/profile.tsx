import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import apiService from '@/utils/apiService';
import { globalAuthState } from '../_layout';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  instructor_name: string;
  enrolled_at?: string;
  progress_percentage?: number;
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUserData();
    loadEnrolledCourses();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // First, try to load from cache
      const cacheKey = 'profile_user_data';
      const cachedData = await AsyncStorage.getItem(cacheKey);
      
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        const cacheAge = Date.now() - parsedData.timestamp;
        const cacheValid = cacheAge < 10 * 60 * 1000; // 10 minutes cache for user data
        
        if (cacheValid) {
          console.log('Loading user data from cache:', parsedData.data.name);
          setUser(parsedData.data);
          setLoading(false);
          
          // Fetch fresh data in background
          fetchFreshUserData();
          return;
        }
      }
      
      // No cache or expired, fetch fresh data
      await fetchFreshUserData();
      
    } catch (error: any) {
      console.error('Error loading user data:', error);
      setLoading(false);
    }
  };

  const fetchFreshUserData = async () => {
    try {
      const response = await apiService.get('/user');
      console.log('Fetched fresh user data from backend:', response.data);
      
      if (response.data) {
        setUser(response.data);
        
        // Cache the data
        const cacheKey = 'profile_user_data';
        const cacheData = {
          data: response.data,
          timestamp: Date.now()
        };
        await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheData));
        
        // Also update the main user cache
        await AsyncStorage.setItem('user', JSON.stringify(response.data));
        console.log('Updated cached user data');
      } else {
        console.warn('No user data received from backend.');
        // Fallback to cached data if backend fails
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
          console.log('Using cached user data as fallback');
        }
      }
    } catch (error: any) {
      console.error('Error fetching user data from backend:', error);
      
      // Fallback to cached data if backend request fails
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
          console.log('Using cached user data as fallback');
        } else {
          console.warn('No cached user data available.');
        }
      } catch (cacheError) {
        console.error('Error reading cached user data:', cacheError);
      }
      
      let errorMsg = '';
      if (!error.response) {
        errorMsg = 'Unable to connect. Please check your internet connection or try again later.';
      } else if (error?.response?.data?.errors) {
        errorMsg = Object.entries(error.response.data.errors)
          .map(([field, msgs]) => `${capitalize(field)}: ${(msgs as string[])[0]}`)
          .join('\n');
      } else if (error?.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else {
        errorMsg = 'Failed to load user data. Please try again.';
      }
      console.error('Error loading user data:', error?.response?.data || error);
      setError(errorMsg);
    }
    setLoading(false);
  };
  
  const loadEnrolledCourses = async () => {
    try {
      setLoading(true);
      
      // First, try to load from cache
      const cacheKey = 'profile_enrolled_courses';
      const cachedData = await AsyncStorage.getItem(cacheKey);
      
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        const cacheAge = Date.now() - parsedData.timestamp;
        const cacheValid = cacheAge < 3 * 60 * 1000; // 3 minutes cache
        
        if (cacheValid) {
          console.log('Loading enrolled courses from cache for profile:', parsedData.data.length, 'courses');
          setEnrolledCourses(parsedData.data);
          setLoading(false);
          
          // Fetch fresh data in background
          fetchFreshEnrolledCourses();
          return;
        }
      }
      
      // No cache or expired, fetch fresh data
      await fetchFreshEnrolledCourses();
      
    } catch (error: any) {
      console.error('Error loading enrolled courses for profile:', error);
      setLoading(false);
    }
  };

  const fetchFreshEnrolledCourses = async () => {
    try {
      const response = await apiService.get('/my-courses');
      console.log('Fetched fresh enrolled courses for profile:', response.data);
      
      // Handle both response formats
      let courses = [];
      if (Array.isArray(response.data)) {
        courses = response.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        courses = response.data.data;
      } else {
        console.error('Unexpected response format from /my-courses:', response.data);
        courses = [];
      }
      
      // Cache the data
      const cacheKey = 'profile_enrolled_courses';
      const cacheData = {
        data: courses,
        timestamp: Date.now()
      };
      await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheData));
      
      setEnrolledCourses(courses);
    } catch (error: any) {
      let errorMsg = '';
      if (!error.response) {
        errorMsg = 'Unable to connect. Please check your internet connection or try again later.';
      } else if (error?.response?.data?.errors) {
        errorMsg = Object.entries(error.response.data.errors)
          .map(([field, msgs]) => `${capitalize(field)}: ${(msgs as string[])[0]}`)
          .join('\n');
      } else if (error?.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else {
        errorMsg = 'Failed to load your enrolled courses. Please try again.';
      }
      console.error('Error loading enrolled courses:', error?.response?.data || error);
      setError(errorMsg);
    }
    setLoading(false);
  };
  

  
  // Calculate average progress
  const calculateAverageProgress = () => {
    if (enrolledCourses.length === 0) return 0;
    
    const totalProgress = enrolledCourses.reduce((acc, course) => {
      // Convert string percentages to numbers if needed
      const progress = typeof course.progress_percentage === 'string' ? 
        parseFloat(course.progress_percentage) : 
        (course.progress_percentage || 0);
      return acc + progress;
    }, 0);
    
    return Math.round(totalProgress / enrolledCourses.length);
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Logging out...');
              // Clear token and user data
              await AsyncStorage.removeItem('token');
              await AsyncStorage.removeItem('user');
              console.log('Token and user data cleared');
              
              // Clear all app cache
              await globalAuthState.logout();
              
              // Update global authentication state immediately
              globalAuthState.setIsAuthenticated(false);
              console.log('Global authentication state updated to false');
              
              // Navigate immediately to login screen
              console.log('Navigating to login screen');
              router.replace('/Login');
            } catch (error) {
              console.error('Error logging out:', error);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString || dateString === 'N/A') return 'today';
    
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) return 'today';
      
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        return 'today';
      } else if (diffDays === 2) {
        return 'yesterday';
      } else if (diffDays < 7) {
        return `${diffDays} days ago`;
      } else {
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      }
    } catch (e) {
      console.error('Error formatting date:', e);
      return 'today';
    }
  };

  const menuItems = [
    {
      icon: 'person-outline',
      title: 'Edit Profile',
      subtitle: 'Update your personal information',
      onPress: () => Alert.alert('Coming Soon', 'Profile editing will be available soon!'),
    },
    {
      icon: 'notifications-outline',
      title: 'Notifications',
      subtitle: 'Manage your notification preferences',
      onPress: () => Alert.alert('Coming Soon', 'Notification settings will be available soon!'),
    },
    {
      icon: 'shield-outline',
      title: 'Privacy & Security',
      subtitle: 'Manage your privacy settings',
      onPress: () => Alert.alert('Coming Soon', 'Privacy settings will be available soon!'),
    },
    {
      icon: 'help-circle-outline',
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      onPress: () => Alert.alert('Coming Soon', 'Help center will be available soon!'),
    },
    {
      icon: 'information-circle-outline',
      title: 'About',
      subtitle: 'App version and information',
      onPress: () => Alert.alert('About EduConnect', 'Version 1.0.0\nA modern learning management system'),
    },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <ThemedText style={styles.headerTitle}>Profile</ThemedText>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* User Info Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={40} color="#667eea" />
            </View>
          </View>
          <View style={styles.userInfo}>
            <ThemedText style={styles.userName}>
              {user?.name || 'Student'}
            </ThemedText>
            <ThemedText style={styles.userEmail}>
              {user?.email || 'student@example.com'}
            </ThemedText>
            <ThemedText style={styles.userRole}>
              {user?.role ? capitalize(user.role) : 'Student'}
            </ThemedText>
            <ThemedText style={styles.memberSince}>
              Member since {user?.created_at ? formatDate(user.created_at) : 'today'}
            </ThemedText>
          </View>
        </View>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          {loading ? (
            <ActivityIndicator size="small" color="#667eea" />
          ) : (
            <>
              <View style={styles.statItem}>
                <ThemedText style={styles.statNumber}>{enrolledCourses.length}</ThemedText>
                <ThemedText style={styles.statLabel}>Courses</ThemedText>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <ThemedText style={styles.statNumber}>{calculateAverageProgress()}%</ThemedText>
                <ThemedText style={styles.statLabel}>Avg Progress</ThemedText>
              </View>
            </>
          )}
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <ThemedText style={styles.sectionTitle}>Settings</ThemedText>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIcon}>
                  <Ionicons name={item.icon as any} size={20} color="#667eea" />
                </View>
                <View style={styles.menuText}>
                  <ThemedText style={styles.menuTitle}>{item.title}</ThemedText>
                  <ThemedText style={styles.menuSubtitle}>{item.subtitle}</ThemedText>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => router.push('/courses')}
          >
            <Ionicons name="search-outline" size={24} color="#667eea" />
            <ThemedText style={styles.quickActionText}>Browse Courses</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => router.push('/my-courses')}
          >
            <Ionicons name="library-outline" size={24} color="#667eea" />
            <ThemedText style={styles.quickActionText}>My Courses</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  logoutButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  userCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    marginRight: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 12,
    color: '#999',
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#f0f0f0',
  },
  menuSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  menuItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
}); 