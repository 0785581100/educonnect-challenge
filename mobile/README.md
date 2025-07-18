# 📱 EduConnect Mobile App

A React Native mobile application built with Expo for the EduConnect e-learning platform. This app provides students with a seamless learning experience, allowing them to browse courses, enroll in classes, track their progress, and manage their learning journey.

## 🚀 Features

### **Core Functionality**
- **User Authentication**: Secure login/register with JWT tokens
- **Course Browsing**: Browse available courses with detailed information
- **Course Enrollment**: Enroll in courses with one-tap enrollment
- **Progress Tracking**: View enrollment status and progress percentages
- **User Profile**: Manage user information and view account details
- **Offline Support**: Cached data for improved performance

### **User Experience**
- **Modern UI/UX**: Clean, intuitive interface with consistent theming
- **Bottom Navigation**: Easy navigation between main sections
- **Pull-to-Refresh**: Refresh data with intuitive gestures
- **Loading States**: Smooth loading indicators and error handling
- **Responsive Design**: Optimized for various screen sizes

### **Technical Features**
- **TypeScript**: Full type safety and better development experience
- **Expo Router**: File-based routing with deep linking support
- **AsyncStorage**: Local data persistence and caching
- **Axios**: HTTP client with automatic token management
- **Linear Gradients**: Beautiful visual effects and theming

## 🛠 Tech Stack

### **Core Technologies**
- **React Native**: 0.79.5
- **Expo**: ~53.0.17 (SDK 53)
- **TypeScript**: ~5.8.3
- **React**: 19.0.0

### **Key Dependencies**
- **Expo Router**: File-based navigation
- **Axios**: HTTP client for API communication
- **AsyncStorage**: Local data persistence
- **Expo Linear Gradient**: Visual effects
- **React Navigation**: Navigation framework
- **Expo Vector Icons**: Icon library

### **Development Tools**
- **ESLint**: Code linting and formatting
- **TypeScript**: Static type checking
- **Expo CLI**: Development and build tools

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

### **Required Software**
- **Node.js**: Version 18 or higher
- **npm** or **yarn**: Package manager
- **Expo CLI**: `npm install -g @expo/cli`
- **Git**: Version control

### **Mobile Development Setup**
- **iOS Simulator** (macOS only): Xcode with iOS Simulator
- **Android Emulator**: Android Studio with AVD
- **Physical Device**: Expo Go app installed

## 🚀 Installation & Setup

### **1. Clone the Repository**
```bash
git clone <repository-url>
cd educonnect-challenge/mobile
```

### **2. Install Dependencies**
```bash
npm install
# or
yarn install
```

### **3. Environment Configuration**

The app is configured to connect to the backend API. Update the API base URL in `constants/api.ts` if needed:

```typescript
// For Android emulator
baseUrl = 'http://10.0.3.2:8000/api';

// For iOS simulator
baseUrl = 'http://localhost:8000/api';

// For physical device (use your computer's IP)
baseUrl = 'http://192.168.1.100:8000/api';
```

### **4. Start the Development Server**
```bash
# Start Expo development server
npx expo start

# Or use npm scripts
npm start
```

### **5. Run on Different Platforms**

#### **iOS Simulator (macOS only)**
```bash
npm run ios
# or
npx expo start --ios
```

#### **Android Emulator**
```bash
npm run android
# or
npx expo start --android
```

#### **Web Browser**
```bash
npm run web
# or
npx expo start --web
```

#### **Physical Device**
1. Install **Expo Go** app from App Store/Google Play
2. Scan the QR code displayed in the terminal
3. The app will load on your device

## 📱 App Structure

### **File Organization**
```
mobile/
├── app/                    # Main application code
│   ├── (tabs)/            # Tab-based navigation
│   │   ├── index.tsx      # Home screen
│   │   ├── courses.tsx    # Course listing
│   │   ├── my-courses.tsx # Enrolled courses
│   │   ├── profile.tsx    # User profile
│   │   └── courses/       # Course detail pages
│   │       └── [id].tsx   # Individual course view
│   ├── Login.tsx          # Login screen
│   ├── register.tsx       # Registration screen
│   └── _layout.tsx        # Root layout
├── components/            # Reusable components
│   ├── AuthGuard.tsx      # Authentication wrapper
│   ├── ThemedText.tsx     # Styled text component
│   └── ui/                # UI components
├── constants/             # App constants
│   ├── api.ts            # API configuration
│   └── Colors.ts         # Color definitions
├── hooks/                # Custom React hooks
├── utils/                # Utility functions
│   ├── apiService.ts     # API service layer
│   └── cacheManager.ts   # Cache management
└── assets/               # Static assets
```

### **Navigation Structure**
- **Tab Navigation**: Home, Courses, My Courses, Profile
- **Stack Navigation**: Course details, Authentication screens
- **Deep Linking**: Direct navigation to specific courses

## 🔧 Configuration

### **API Configuration**
The app automatically configures API endpoints based on the platform:

```typescript
// constants/api.ts
let baseUrl = 'http://localhost:8000/api';

if (Platform.OS === 'android') {
  baseUrl = 'http://10.0.3.2:8000/api';
}
```

### **Authentication**
- **JWT Tokens**: Stored securely in AsyncStorage
- **Automatic Token Refresh**: Handled by API interceptors
- **Global State Management**: Centralized authentication state

### **Caching Strategy**
- **Cache-First Approach**: Load cached data immediately
- **Background Refresh**: Update data in background
- **Cache Invalidation**: Clear cache on logout
- **Preloading**: Load common data on app startup

## 🎨 UI/UX Design

### **Design System**
- **Color Palette**: Purple gradient theme (#667eea to #764ba2)
- **Typography**: Consistent text styling with ThemedText component
- **Spacing**: 20px standard margins and padding
- **Shadows**: Subtle elevation effects for cards

### **Components**
- **Cards**: White background with rounded corners
- **Buttons**: Purple primary buttons with white text
- **Icons**: Ionicons for consistent iconography
- **Loading States**: Activity indicators and skeleton screens

## 🔐 Security Features

### **Authentication**
- **Secure Token Storage**: JWT tokens in AsyncStorage
- **Automatic Logout**: Clear data on authentication failure
- **Protected Routes**: Authentication guards for sensitive screens

### **Data Protection**
- **Input Validation**: Client-side validation for forms
- **Error Handling**: Graceful error handling and user feedback
- **Secure API Calls**: HTTPS communication with backend

## 📊 Performance Optimizations

### **Caching Strategy**
- **Course Data**: Cached for 5 minutes with background refresh
- **User Data**: Cached with automatic updates
- **Enrollment Data**: Real-time updates with cache invalidation

### **Loading Optimization**
- **Skeleton Screens**: Placeholder content while loading
- **Progressive Loading**: Load essential data first
- **Image Optimization**: Optimized images and icons

## 🧪 Testing

### **Available Scripts**
```bash
# Lint code
npm run lint

# Reset project (clear cache and restart)
npm run reset-project
```

### **Testing Strategy**
- **Manual Testing**: Test on different devices and platforms
- **API Testing**: Verify backend communication
- **UI Testing**: Test navigation and user interactions

## 🚀 Deployment

### **Building for Production**

#### **Android APK**
```bash
npx expo build:android
```

#### **iOS IPA**
```bash
npx expo build:ios
```

#### **Web Build**
```bash
npx expo build:web
```

### **App Store Deployment**
1. Configure app.json with production settings
2. Build production version
3. Submit to App Store/Google Play Store

## 🔧 Troubleshooting

### **Common Issues**

#### **Metro Bundler Issues**
```bash
# Clear Metro cache
npx expo start --clear

# Reset project
npm run reset-project
```

#### **API Connection Issues**
- Verify backend server is running
- Check API base URL configuration
- Ensure correct IP address for emulator/device

#### **Authentication Issues**
- Clear AsyncStorage: `npm run reset-project`
- Verify backend authentication endpoints
- Check token expiration

### **Development Tips**
- Use Expo DevTools for debugging
- Enable React Native Debugger for advanced debugging
- Monitor network requests in browser dev tools

## 📚 API Integration

### **Endpoints Used**
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `GET /api/courses` - List all courses
- `GET /api/courses/{id}` - Course details
- `POST /api/courses/{id}/enroll` - Enroll in course
- `GET /api/my-courses` - User's enrolled courses
- `GET /api/user` - User profile data

### **Error Handling**
- Network errors with retry functionality
- Authentication errors with automatic logout
- Validation errors with user-friendly messages

## 🤝 Contributing

### **Development Workflow**
1. Create feature branch
2. Implement changes with TypeScript
3. Test on multiple platforms
4. Submit pull request

### **Code Standards**
- Use TypeScript for all new code
- Follow ESLint configuration
- Write descriptive commit messages
- Test on both iOS and Android

## 📄 License

This project is part of the EduConnect e-learning platform.

## 🆘 Support

For technical support or questions:
- Check the troubleshooting section
- Review API documentation
- Verify backend server status
- Test with different devices/platforms

---

**EduConnect Mobile App** - Empowering students with seamless learning experiences 📚✨
