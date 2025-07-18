# 🎓 EduConnect E-Learning Platform

A comprehensive e-learning platform consisting of a React Native mobile application and a Laravel backend API. EduConnect provides students with a seamless learning experience, allowing them to browse courses, enroll in classes, track their progress, and manage their learning journey.

## 📋 Project Overview

### **Architecture**
- **Frontend**: React Native mobile app with Expo
- **Backend**: Laravel REST API with Filament admin panel
- **Database**: MySQL/PostgreSQL
- **Authentication**: JWT tokens with Laravel Sanctum
- **Deployment**: Cross-platform mobile app with web admin interface

### **Key Features**
- 🔐 **Secure Authentication**: JWT-based user authentication
- 📚 **Course Management**: Browse, enroll, and track course progress
- 👥 **User Roles**: Admin, instructor, and student roles
- 📊 **Progress Tracking**: Real-time enrollment and progress monitoring
- 🎨 **Modern UI**: Clean, intuitive mobile interface
- ⚡ **Performance**: Cached data and optimized loading
- 🔧 **Admin Panel**: Comprehensive backend management interface

## 🏗️ Project Structure

```
educonnect-challenge/
├── mobile/                 # React Native mobile application
│   ├── app/               # Main application code
│   ├── components/        # Reusable components
│   ├── constants/         # App constants and configuration
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   └── assets/           # Static assets
├── backend/               # Laravel backend API
│   ├── app/              # Application logic
│   ├── database/         # Migrations and seeders
│   ├── routes/           # API route definitions
│   └── config/           # Configuration files
└── README.md             # This file
```

## 🚀 Quick Start

### **Prerequisites**
- **Node.js**: Version 18 or higher
- **PHP**: Version 7.3 or higher (8.0+ recommended)
- **Composer**: PHP package manager
- **MySQL/PostgreSQL**: Database server
- **Expo CLI**: `npm install -g @expo/cli`

### **1. Clone the Repository**
```bash
git clone <repository-url>
cd educonnect-challenge
```

### **2. Backend Setup**
```bash
cd backend

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure database in .env file
# DB_DATABASE=educonnect
# DB_USERNAME=your_username
# DB_PASSWORD=your_password

# Run migrations
php artisan migrate

# Seed database (optional)
php artisan db:seed

# Start development server
php artisan serve
```

### **3. Mobile App Setup**
```bash
cd mobile

# Install dependencies
npm install

# Start development server
npx expo start
```

### **4. Access the Applications**
- **Backend API**: `http://localhost:8000/api`
- **Admin Panel**: `http://localhost:8000/admin`
- **Mobile App**: Scan QR code with Expo Go app

## 📱 Mobile Application

### **Features**
- **User Authentication**: Login/register with JWT tokens
- **Course Browsing**: View available courses with details
- **Course Enrollment**: One-tap course enrollment
- **Progress Tracking**: Monitor learning progress
- **User Profile**: Manage account information
- **Offline Support**: Cached data for better performance

### **Tech Stack**
- **React Native**: 0.79.5
- **Expo**: ~53.0.17 (SDK 53)
- **TypeScript**: ~5.8.3
- **Expo Router**: File-based navigation
- **Axios**: HTTP client for API communication
- **AsyncStorage**: Local data persistence

### **Running the Mobile App**
```bash
cd mobile

# Install dependencies
npm install

# Start development server
npx expo start

# Run on specific platform
npm run ios      # iOS simulator
npm run android  # Android emulator
npm run web      # Web browser
```

### **Configuration**
Update API base URL in `constants/api.ts`:
```typescript
// For Android emulator
baseUrl = 'http://10.0.3.2:8000/api';

// For iOS simulator
baseUrl = 'http://localhost:8000/api';

// For physical device
baseUrl = 'http://192.168.1.100:8000/api';
```

## 🏗️ Backend API

### **Features**
- **RESTful API**: Complete CRUD operations
- **Authentication**: JWT-based authentication with Sanctum
- **Course Management**: Full course lifecycle management
- **Enrollment System**: Student enrollment tracking
- **Admin Panel**: Filament-based administrative interface
- **Database Management**: Migrations, seeders, and relationships

### **Tech Stack**
- **Laravel**: 8.x (PHP Framework)
- **PHP**: 7.3+ or 8.0+
- **MySQL/PostgreSQL**: Database
- **Laravel Sanctum**: API Authentication
- **Filament**: Admin panel framework

### **Running the Backend**
```bash
cd backend

# Install dependencies
composer install

# Configure environment
cp .env.example .env
php artisan key:generate

# Setup database
php artisan migrate
php artisan db:seed

# Start server
php artisan serve
```

### **API Endpoints**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/courses` - List all courses
- `GET /api/courses/{id}` - Course details
- `POST /api/courses/{id}/enroll` - Enroll in course
- `GET /api/my-courses` - User's enrolled courses
- `GET /api/user` - User profile

## 🗄️ Database Schema

### **Core Tables**
- **users**: User accounts with roles (admin, instructor, student)
- **courses**: Course information with instructor relationships
- **enrollments**: Student course enrollments with progress tracking

### **Relationships**
- Users can be instructors for multiple courses
- Users can enroll in multiple courses
- Courses have one instructor and multiple enrollments
- Enrollments track progress percentages

## 🔐 Authentication & Security

### **Authentication Flow**
1. User registers/logs in via API endpoints
2. Server returns JWT token
3. Mobile app stores token securely
4. Token included in all subsequent API requests
5. Server validates token for protected routes

### **Security Features**
- **JWT Tokens**: Secure token-based authentication
- **Password Hashing**: Bcrypt password encryption
- **CORS Protection**: Cross-origin resource sharing
- **Input Validation**: Comprehensive request validation
- **Role-Based Access**: User role management

## 🎨 UI/UX Design

### **Design System**
- **Color Palette**: Purple gradient theme (#667eea to #764ba2)
- **Typography**: Consistent text styling
- **Spacing**: 20px standard margins and padding
- **Components**: Reusable UI components
- **Icons**: Ionicons for consistent iconography

### **Mobile Interface**
- **Bottom Navigation**: Easy navigation between sections
- **Pull-to-Refresh**: Intuitive data refresh
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages
- **Responsive Design**: Optimized for various screen sizes

## 📊 Performance & Optimization

### **Mobile App**
- **Caching Strategy**: Cache-first approach with background refresh
- **AsyncStorage**: Local data persistence
- **Image Optimization**: Optimized assets and icons
- **Bundle Optimization**: Efficient code splitting

### **Backend API**
- **Database Indexing**: Optimized query performance
- **Caching**: Configuration and route caching
- **Eloquent ORM**: Efficient database operations
- **API Pagination**: Paginated responses for large datasets

## 🧪 Testing

### **Mobile App Testing**
```bash
cd mobile

# Lint code
npm run lint

# Reset project (clear cache)
npm run reset-project
```

### **Backend Testing**
```bash
cd backend

# Run all tests
php artisan test

# Run specific test
php artisan test tests/Feature/AuthTest.php
```

## 🚀 Deployment

### **Mobile App Deployment**
```bash
cd mobile

# Build for production
npx expo build:android  # Android APK
npx expo build:ios      # iOS IPA
npx expo build:web      # Web build
```

### **Backend Deployment**
```bash
cd backend

# Production optimization
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set permissions
chmod -R 755 storage bootstrap/cache
```

## 🔧 Development Workflow

### **Getting Started**
1. Clone the repository
2. Set up backend (database, migrations, seeders)
3. Configure mobile app API endpoints
4. Start both development servers
5. Test authentication and core features

### **Development Tips**
- Use Expo DevTools for mobile debugging
- Check Laravel logs for backend issues
- Test on multiple devices/platforms
- Verify API communication between apps
- Use proper error handling and validation

## 📚 Documentation

### **Detailed Documentation**
- **[Mobile App Documentation](mobile/README.md)**: Complete mobile app guide
- **[Backend API Documentation](backend/README.md)**: Backend setup and API guide
- **[API Reference](backend/API_DOCUMENTATION.md)**: Detailed API endpoints

### **Key Resources**
- **Expo Documentation**: https://docs.expo.dev/
- **Laravel Documentation**: https://laravel.com/docs/
- **React Native Documentation**: https://reactnative.dev/docs/

## 🤝 Contributing

### **Development Guidelines**
1. Follow TypeScript standards for mobile app
2. Follow PSR-12 standards for backend
3. Write tests for new features
4. Update documentation for changes
5. Test on multiple platforms

### **Code Standards**
- **Mobile**: TypeScript, ESLint, Expo standards
- **Backend**: PHP PSR-12, Laravel conventions
- **Git**: Meaningful commit messages
- **Testing**: Unit and integration tests

## 🆘 Support & Troubleshooting

### **Common Issues**

#### **Mobile App**
- **Metro Bundler Issues**: `npx expo start --clear`
- **API Connection**: Verify backend server and IP configuration
- **Authentication**: Clear AsyncStorage and retry

#### **Backend**
- **Database Connection**: Check `.env` configuration
- **Permission Issues**: Set proper storage permissions
- **Composer Issues**: Clear cache and reinstall dependencies

### **Getting Help**
- Check the troubleshooting sections in individual README files
- Review API documentation for endpoint details
- Verify both applications are running correctly
- Test with different devices and platforms

## 📄 License

This project is part of the EduConnect e-learning platform.

## 🎯 Project Goals

EduConnect aims to provide:
- **Seamless Learning Experience**: Intuitive mobile interface for students
- **Robust Backend**: Scalable API for course management
- **Modern Technology**: Latest frameworks and best practices
- **Cross-Platform Support**: iOS, Android, and web compatibility
- **Scalable Architecture**: Ready for production deployment

---

**EduConnect** - Empowering the future of education through technology 📚✨

*Built with React Native, Laravel, and modern web technologies* 