import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import apiService from '@/utils/apiService';

interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  instructor_name: string;
  enrolled_at: string;
  progress_percentage: number;
}

export default function MyCoursesScreen() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      
      // First, try to load from cache
      const cacheKey = 'my_courses';
      const cachedData = await AsyncStorage.getItem(cacheKey);
      
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        const cacheAge = Date.now() - parsedData.timestamp;
        const cacheValid = cacheAge < 3 * 60 * 1000; // 3 minutes cache
        
        if (cacheValid) {
          console.log('Loading my courses from cache:', parsedData.data.length, 'courses');
          setCourses(parsedData.data);
          setLoading(false);
          
          // Fetch fresh data in background
          fetchFreshMyCourses();
          return;
        }
      }
      
      // No cache or expired, fetch fresh data
      await fetchFreshMyCourses();
      
    } catch (error: any) {
      console.error('Error loading my courses:', error);
      setLoading(false);
    }
  };

  const fetchFreshMyCourses = async () => {
    try {
      const response = await apiService.get('/my-courses');
      console.log('Fetched fresh my courses:', response.data);
      
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
      const cacheKey = 'my_courses';
      const cacheData = {
        data: courses,
        timestamp: Date.now()
      };
      await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheData));
      
      setCourses(courses);
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
        errorMsg = 'Failed to load your courses. Please try again.';
      }
      console.error('Error loading courses:', error?.response?.data || error);
    }
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCourses();
    setRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <ThemedText style={styles.headerTitle}>My Courses</ThemedText>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ThemedText style={styles.loadingText}>Loading your courses...</ThemedText>
          </View>
        ) : courses.length > 0 ? (
          courses.map((course) => (
            <TouchableOpacity
              key={course.id}
              style={styles.courseCard}
              onPress={() => router.push(`/courses/${course.id}`)}
            >
              <View style={styles.courseHeader}>
                <View style={styles.courseInfo}>
                  <ThemedText style={styles.courseTitle}>{course.title}</ThemedText>
                  <ThemedText style={styles.courseInstructor}>
                    by {course.instructor_name || 'Unknown Instructor'}
                  </ThemedText>
                  <ThemedText style={styles.enrolledDate}>
                    Enrolled: {formatDate(course.enrolled_at)}
                  </ThemedText>
                </View>
                <View style={styles.progressCircle}>
                  <ThemedText style={styles.progressPercentage}>
                    {course.progress_percentage}%
                  </ThemedText>
                </View>
              </View>
              
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

              <View style={styles.courseDescription}>
                <ThemedText style={styles.descriptionText} numberOfLines={2}>
                  {course.description}
                </ThemedText>
              </View>

              <View style={styles.courseFooter}>
                <View style={styles.priceContainer}>
                  <ThemedText style={styles.priceText}>
                    ${course.price}
                  </ThemedText>
                </View>
                <TouchableOpacity style={styles.continueButton}>
                  <ThemedText style={styles.continueButtonText}>Continue Learning</ThemedText>
                  <Ionicons name="play" size={16} color="white" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="library-outline" size={64} color="#ccc" />
            <ThemedText style={styles.emptyTitle}>No Courses Yet</ThemedText>
            <ThemedText style={styles.emptyText}>
              You haven't enrolled in any courses yet. Start your learning journey by browsing our course catalog.
            </ThemedText>
            <TouchableOpacity 
              style={styles.browseButton}
              onPress={() => router.push('/courses')}
            >
              <ThemedText style={styles.browseButtonText}>Browse Courses</ThemedText>
            </TouchableOpacity>
          </View>
        )}
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
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  courseCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  courseInfo: {
    flex: 1,
    marginRight: 15,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  courseInstructor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  enrolledDate: {
    fontSize: 12,
    color: '#999',
  },
  progressCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressPercentage: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressContainer: {
    marginBottom: 15,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#667eea',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
  },
  courseDescription: {
    marginBottom: 15,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#667eea',
  },
  continueButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  continueButtonText: {
    color: 'white',
    fontWeight: '600',
    marginRight: 6,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  browseButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
}); 

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
} 