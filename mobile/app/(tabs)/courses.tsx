import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import apiService from '@/utils/apiService';

// Define the Course type
type Course = {
  id: number;
  title: string;
  description: string;
  instructor_name: string;
  price: string | number;
  status: string;
};

export default function CoursesScreen() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const fetchCourses = async () => {
    setLoading(true);
    setError('');
    
    try {
      // First, try to load from cache
      const cacheKey = 'all_courses';
      const cachedData = await AsyncStorage.getItem(cacheKey);
      
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        const cacheAge = Date.now() - parsedData.timestamp;
        const cacheValid = cacheAge < 5 * 60 * 1000; // 5 minutes cache
        
        if (cacheValid) {
          console.log('Loading courses from cache:', parsedData.data.length, 'courses');
          setCourses(parsedData.data);
          setLoading(false);
          
          // Fetch fresh data in background
          fetchFreshCourses();
          return;
        }
      }
      
      // No cache or expired, fetch fresh data
      await fetchFreshCourses();
      
    } catch (error: any) {
      console.error('Error loading courses:', error);
      setLoading(false);
    }
  };

  const fetchFreshCourses = async () => {
    try {
      const res = await apiService.get('/courses');
      console.log('Fetched fresh courses:', res.data);
      
      // Handle paginated response
      let coursesData = [];
      if (res.data && res.data.data && Array.isArray(res.data.data)) {
        coursesData = res.data.data;
      } else if (Array.isArray(res.data)) {
        coursesData = res.data;
      } else {
        console.error('Unexpected response format from /courses:', res.data);
        coursesData = [];
      }
      
      // Cache the data
      const cacheKey = 'all_courses';
      const cacheData = {
        data: coursesData,
        timestamp: Date.now()
      };
      await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheData));
      
      setCourses(coursesData);
    } catch (err: any) {
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
        errorMsg = 'Failed to load courses. Please try again.';
      }
      console.error('Error fetching courses:', err?.response?.data || err);
      setError(errorMsg);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCourses();
    setRefreshing(false);
  };

  const renderCourse = ({ item }: { item: Course }) => (
    <TouchableOpacity 
      style={styles.courseCard} 
      onPress={() => router.push(`/courses/${item.id}`)}
    >
      <View style={styles.courseInfo}>
        <ThemedText style={styles.courseTitle}>{item.title}</ThemedText>
        <ThemedText style={styles.courseDescription} numberOfLines={2}>
          {item.description}
        </ThemedText>
        <ThemedText style={styles.courseInstructor}>
          by {item.instructor_name || 'Unknown Instructor'}
        </ThemedText>
        <View style={styles.courseMeta}>
          <View style={styles.priceContainer}>
            <Ionicons name="pricetag-outline" size={16} color="#667eea" />
            <ThemedText style={styles.price}>${item.price}</ThemedText>
          </View>
          <View style={styles.statusContainer}>
            <ThemedText style={[
              styles.status, 
              item.status === 'active' ? styles.activeStatus : styles.inactiveStatus
            ]}>
              {item.status.toUpperCase()}
            </ThemedText>
          </View>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#667eea" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <ThemedText style={styles.headerTitle}>Browse Courses</ThemedText>
          <Ionicons name="search-outline" size={24} color="white" />
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#667eea" />
            <ThemedText style={styles.loadingText}>Loading courses...</ThemedText>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={48} color="#ff6b6b" />
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          </View>
        ) : courses.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={48} color="#ccc" />
            <ThemedText style={styles.emptyText}>No courses available</ThemedText>
          </View>
        ) : (
          <FlatList
            data={courses}
            keyExtractor={item => item.id.toString()}
            renderItem={renderCourse}
            contentContainerStyle={styles.courseList}
            refreshControl={
              <RefreshControl 
                refreshing={refreshing} 
                onRefresh={onRefresh}
                colors={['#667eea']}
                tintColor="#667eea"
              />
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  courseList: {
    paddingBottom: 20,
  },
  courseCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  courseDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  courseInstructor: {
    fontSize: 14,
    color: '#667eea',
    marginBottom: 8,
    fontWeight: '500',
  },
  courseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 4,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  status: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  activeStatus: {
    backgroundColor: '#e8f5e8',
    color: '#27ae60',
  },
  inactiveStatus: {
    backgroundColor: '#ffeaea',
    color: '#e74c3c',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#ff6b6b',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
} 