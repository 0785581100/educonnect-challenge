import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from '@/utils/apiService';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.get(`/courses/${id}`);
      console.log('Course data:', response.data);
      setCourse(response.data);
    } catch (err: any) {
      console.error('Error fetching course:', err);
      setError(err.response?.data?.message || 'Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const fetchFreshData = async () => {
    try {
      console.log('Fetching fresh course data...');
      const response = await apiService.get(`/courses/${id}`);
      setCourse(response.data);
      
      // Update cache with fresh data
      const cacheKey = `course_${id}`;
      await AsyncStorage.setItem(cacheKey, JSON.stringify({
        data: response.data,
        timestamp: Date.now()
      }));
      console.log('Updated course cache with fresh data');
    } catch (err: any) {
      console.error('Error fetching fresh course data:', err);
      setError(err.response?.data?.message || 'Failed to refresh course data');
    }
  };

  const loadCurrentUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setCurrentUser(user);
        console.log('Loaded current user:', user);
      }
    } catch (error) {
      console.error('Error loading current user:', error);
    }
  };

  const isUserEnrolled = () => {
    if (!course?.enrollments || !currentUser) return false;
    return course.enrollments.some((enrollment: any) => 
      enrollment.user?.id === currentUser.id
    );
  };

  useEffect(() => {
    const loadCourse = async () => {
      try {
        setLoading(true);
        
        // Try to load from cache first
        const cacheKey = `course_${id}`;
        const cachedData = await AsyncStorage.getItem(cacheKey);
        
        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData);
          const cacheAge = Date.now() - timestamp;
          const cacheValid = cacheAge < 5 * 60 * 1000; // 5 minutes
          
          if (cacheValid) {
            console.log('Loading course from cache');
            setCourse(data);
            setLoading(false);
            
            // Fetch fresh data in background
            fetchFreshData();
            return;
          }
        }
        
        // No valid cache, fetch fresh data
        await fetchCourse();
      } catch (error) {
        console.error('Error in loadCourse:', error);
        setError('Failed to load course');
        setLoading(false);
      }
    };

    const preloadCourse = async () => {
      await Promise.all([loadCourse(), loadCurrentUser()]);
    };

    preloadCourse();
  }, [id]);

  const handleEnroll = async () => {
    try {
      setEnrolling(true);
      setError(null);
      setSuccess(null);
      
      const response = await apiService.post(`/courses/${id}/enroll`);
      console.log('Enrollment response:', response.data);
      
      setSuccess('Successfully enrolled in course!');
      
      // Update the course data to reflect enrollment
      const updatedCourse = { ...course };
      if (!updatedCourse.enrollments) {
        updatedCourse.enrollments = [];
      }
      
      // Add current user to enrollments
      updatedCourse.enrollments.push({
        id: response.data.enrollment_id,
        user: currentUser,
        progress_percentage: 0
      });
      
      setCourse(updatedCourse);
      
      // Update cache
      const cacheKey = `course_${id}`;
      await AsyncStorage.setItem(cacheKey, JSON.stringify({
        data: updatedCourse,
        timestamp: Date.now()
      }));
      
      // Clear related caches to ensure fresh data
      await AsyncStorage.removeItem('enrolled_courses');
      await AsyncStorage.removeItem('my_courses');
      
    } catch (err: any) {
      console.error('Error enrolling:', err);
      setError(err.response?.data?.message || 'Failed to enroll in course');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <ThemedText style={styles.loadingText}>Loading course details...</ThemedText>
      </View>
    );
  }

  if (error && !course) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#e74c3c" />
        <ThemedText style={styles.errorText}>{error}</ThemedText>
        <TouchableOpacity style={styles.retryButton} onPress={fetchCourse}>
          <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
        </TouchableOpacity>
      </View>
    );
  }

  if (!course) {
    return (
      <View style={styles.errorContainer}>
        <ThemedText style={styles.errorText}>Course not found</ThemedText>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: course?.title || 'Course Details',
          headerShown: false 
        }} 
      />
      <View style={styles.container}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <ThemedText style={styles.headerTitle} numberOfLines={1}>
              {course.title}
            </ThemedText>
            <View style={styles.placeholder} />
          </View>
        </LinearGradient>
      
        <ScrollView style={styles.content}>
          <View style={styles.courseCard}>
            <View style={styles.courseHeader}>
              <Ionicons name="book" size={40} color="#667eea" />
              <ThemedText style={styles.title}>{course.title}</ThemedText>
            </View>
            <ThemedText style={styles.instructor}>
              <Ionicons name="person" size={18} color="#667eea" /> {course.instructor?.name}
            </ThemedText>
            <ThemedText style={styles.price}>
              <Ionicons name="pricetag" size={18} color="#667eea" /> ${course.price}
            </ThemedText>
            <View style={styles.statusContainer}>
              <ThemedText style={styles.status}>{course.status.toUpperCase()}</ThemedText>
            </View>
            <ThemedText style={styles.description}>{course.description}</ThemedText>
        
        {/* Show different content based on enrollment status */}
        {isUserEnrolled() ? (
          <View style={styles.enrolledContainer}>
            <Ionicons name="checkmark-circle" size={24} color="#7bed9f" />
            <ThemedText style={styles.enrolledText}>You are enrolled in this course</ThemedText>
            <TouchableOpacity style={styles.continueButton}>
              <ThemedText style={styles.continueButtonText}>Continue Learning</ThemedText>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.enrollButton} onPress={handleEnroll} disabled={enrolling}>
            {enrolling ? <ActivityIndicator color="white" /> : <ThemedText style={styles.enrollButtonText}>Enroll</ThemedText>}
          </TouchableOpacity>
        )}
        
        {success ? <ThemedText style={styles.success}>{success}</ThemedText> : null}
        {error && !loading ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
        
        <View style={styles.sectionContainer}>
          <ThemedText style={styles.sectionTitle}>Enrolled Students</ThemedText>
          {course.enrollments && course.enrollments.length > 0 ? (
            course.enrollments.map((enrollment: any) => (
              <View key={enrollment.id} style={styles.studentRow}>
                <Ionicons name="person-circle" size={20} color="#667eea" />
                <ThemedText style={styles.studentName}>{enrollment.user?.name}</ThemedText>
                <ThemedText style={styles.studentProgress}>{enrollment.progress_percentage}%</ThemedText>
              </View>
            ))
          ) : (
            <ThemedText style={styles.noStudents}>No students enrolled yet.</ThemedText>
          )}
        </View>
          </View>
        </ScrollView>
      </View>
    </>
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  courseCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  courseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    color: '#333',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 12,
    flex: 1,
    flexWrap: 'wrap',
  },
  instructor: {
    color: '#667eea',
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  price: {
    color: '#667eea',
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  statusContainer: {
    marginBottom: 16,
  },
  status: {
    backgroundColor: '#e8f5e8',
    color: '#27ae60',
    fontWeight: 'bold',
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  description: {
    color: '#666',
    fontSize: 16,
    marginBottom: 24,
    lineHeight: 24,
  },
  enrollButton: {
    backgroundColor: '#667eea',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#667eea',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  enrollButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  success: {
    color: '#27ae60',
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: 'bold',
  },
  error: {
    color: '#e74c3c',
    textAlign: 'center',
    marginTop: 20,
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
  },
  studentName: {
    color: '#333',
    fontSize: 15,
    marginLeft: 8,
    flex: 1,
    fontWeight: '500',
  },
  studentProgress: {
    color: '#667eea',
    fontWeight: 'bold',
    fontSize: 14,
  },
  noStudents: {
    color: '#999',
    fontStyle: 'italic',
    marginBottom: 12,
    textAlign: 'center',
  },
  enrolledContainer: {
    backgroundColor: '#e8f5e8',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#27ae60',
  },
  enrolledText: {
    color: '#27ae60',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 16,
  },
  continueButton: {
    backgroundColor: '#27ae60',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#667eea',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 16,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
} 