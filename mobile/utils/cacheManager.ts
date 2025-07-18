import AsyncStorage from '@react-native-async-storage/async-storage';

interface CacheData<T> {
  data: T;
  timestamp: number;
}

export class CacheManager {
  private static instance: CacheManager;
  
  private constructor() {}
  
  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  async get<T>(key: string, maxAge: number = 5 * 60 * 1000): Promise<T | null> {
    try {
      const cachedData = await AsyncStorage.getItem(key);
      if (!cachedData) return null;

      const parsedData: CacheData<T> = JSON.parse(cachedData);
      const cacheAge = Date.now() - parsedData.timestamp;
      
      if (cacheAge < maxAge) {
        console.log(`Cache hit for key: ${key}`);
        return parsedData.data;
      } else {
        console.log(`Cache expired for key: ${key}`);
        await this.remove(key);
        return null;
      }
    } catch (error) {
      console.error(`Error reading cache for key ${key}:`, error);
      return null;
    }
  }

  async set<T>(key: string, data: T): Promise<void> {
    try {
      const cacheData: CacheData<T> = {
        data,
        timestamp: Date.now()
      };
      await AsyncStorage.setItem(key, JSON.stringify(cacheData));
      console.log(`Cached data for key: ${key}`);
    } catch (error) {
      console.error(`Error setting cache for key ${key}:`, error);
    }
  }

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
      console.log(`Removed cache for key: ${key}`);
    } catch (error) {
      console.error(`Error removing cache for key ${key}:`, error);
    }
  }

  async clear(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => 
        key.startsWith('course_') || 
        key.startsWith('enrolled_') || 
        key.startsWith('all_') || 
        key.startsWith('my_') || 
        key.startsWith('profile_')
      );
      await AsyncStorage.multiRemove(cacheKeys);
      console.log('Cleared all app cache');
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  // Preload common data
  async preloadCommonData(): Promise<void> {
    try {
      // Preload user data if available
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        console.log('Preloaded user data');
      }
      
      // Preload enrolled courses if available
      const enrolledCourses = await this.get('enrolled_courses');
      if (enrolledCourses) {
        console.log('Preloaded enrolled courses');
      }
      
      // Preload all courses if available
      const allCourses = await this.get('all_courses');
      if (allCourses) {
        console.log('Preloaded all courses');
      }
    } catch (error) {
      console.error('Error preloading common data:', error);
    }
  }
}

export default CacheManager.getInstance(); 