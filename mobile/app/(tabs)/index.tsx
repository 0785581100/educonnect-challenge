import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
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

export default function HomeScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadUserData();
    loadEnrolledCourses();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
        console.log('Loaded user data:', userData);
      } else {
        console.warn('No user data found in storage.');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadEnrolledCourses = async () => {
    try {
      setLoading(true);
      
      // First, try to load from cache
      const cacheKey = 'enrolled_courses';
      const cachedData = await AsyncStorage.getItem(cacheKey);
      
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        const cacheAge = Date.now() - parsedData.timestamp;
        const cacheValid = cacheAge < 3 * 60 * 1000; // 3 minutes cache
        
        if (cacheValid) {
          console.log('Loading enrolled courses from cache:', parsedData.data.length, 'courses');
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
      console.error('Error loading enrolled courses:', error);
      setLoading(false);
    }
  };

  const fetchFreshEnrolledCourses = async () => {
    try {
      const response = await apiService.get('/my-courses');
      console.log('Fetched fresh enrolled courses:', response.data);
      
      // Handle both response formats
      let courses = [];
      if (Array.isArray(response.data)) {
        courses = response.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        courses = response.data.data;
      } else {
        console.error('Unexpected response format from /my-courses:', response.data);
      }
      
      // Cache the data
      const cacheKey = 'enrolled_courses';
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
    }
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadUserData(), loadEnrolledCourses()]);
    setRefreshing(false);
  };

  const handleLogout = async () => {
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
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            <ThemedText style={styles.greeting}>{getGreeting()}</ThemedText>
            <ThemedText style={styles.userName}>
              {user?.name || 'Student'}
            </ThemedText>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="book-outline" size={24} color="#667eea" />
            <ThemedText style={styles.statNumber}>{enrolledCourses.length}</ThemedText>
            <ThemedText style={styles.statLabel}>Enrolled Courses</ThemedText>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="trophy-outline" size={24} color="#667eea" />
            <ThemedText style={styles.statNumber}>
              {enrolledCourses.length > 0 ? 
                Math.round(enrolledCourses.reduce((acc, course) => {
                  // Convert string percentages to numbers if needed
                  const progress = typeof course.progress_percentage === 'string' ? 
                    parseFloat(course.progress_percentage) : 
                    (course.progress_percentage || 0);
                  return acc + progress;
                }, 0) / enrolledCourses.length) + '%' : 
                '0%'}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Avg Progress</ThemedText>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <ThemedText style={styles.sectionTitle}>Quick Actions</ThemedText>
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/courses')}
            >
              <Ionicons name="search-outline" size={24} color="#667eea" />
              <ThemedText style={styles.actionText}>Browse Courses</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/my-courses')}
            >
              <Ionicons name="library-outline" size={24} color="#667eea" />
              <ThemedText style={styles.actionText}>My Courses</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Courses */}
        <View style={styles.recentContainer}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Recent Courses</ThemedText>
            <TouchableOpacity onPress={() => router.push('/my-courses')}>
              <ThemedText style={styles.seeAllText}>See All</ThemedText>
            </TouchableOpacity>
          </View>
          
          {loading ? (
            <ThemedText style={styles.loadingText}>Loading...</ThemedText>
          ) : enrolledCourses.length > 0 ? (
            enrolledCourses.slice(0, 3).map((course) => (
              <TouchableOpacity
                key={course.id}
                style={styles.courseCard}
                onPress={() => router.push(`/courses/${course.id}`)}
              >
                <View style={styles.courseInfo}>
                  <ThemedText style={styles.courseTitle}>{course.title}</ThemedText>
                  <ThemedText style={styles.courseInstructor}>
                    by {course.instructor_name || 'Unknown Instructor'}
                  </ThemedText>
                  {course.progress_percentage !== undefined && (
                    <View style={styles.progressContainer}>
                      <View style={styles.progressBar}>
                        <View 
                          style={[
                            styles.progressFill, 
                            { width: `${course.progress_percentage}%` }
                          ]} 
                        />
                      </View>
                      <ThemedText style={styles.progressText}>
                        {course.progress_percentage}% Complete
                      </ThemedText>
                    </View>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={20} color="#667eea" />
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="book-outline" size={48} color="#ccc" />
              <ThemedText style={styles.emptyText}>No courses enrolled yet</ThemedText>
              <TouchableOpacity 
                style={styles.browseButton}
                onPress={() => router.push('/courses')}
              >
                <ThemedText style={styles.browseButtonText}>Browse Courses</ThemedText>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
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
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667eea',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  actionsContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
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
  actionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  recentContainer: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  seeAllText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600',
  },
  courseCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  courseInstructor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#667eea',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
  },
  loadingText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    marginBottom: 20,
  },
  browseButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  browseButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
