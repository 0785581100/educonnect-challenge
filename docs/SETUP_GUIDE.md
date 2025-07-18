# 🚀 Quick Setup Guide - EduConnect

This guide will help you get both the mobile app and backend API running in under 10 minutes.

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- [ ] **Node.js** (v18+) installed
- [ ] **PHP** (v7.3+) installed
- [ ] **Composer** installed
- [ ] **MySQL/PostgreSQL** running
- [ ] **Expo CLI**: `npm install -g @expo/cli`
- [ ] **Git** installed

## ⚡ Quick Setup (5 minutes)

### **1. Clone & Navigate**
```bash
git clone <repository-url>
cd educonnect-challenge
```

### **2. Backend Setup (2 minutes)**
```bash
cd backend

# Install dependencies
composer install

# Setup environment
cp .env.example .env
php artisan key:generate

# Configure database (edit .env file)
# DB_DATABASE=educonnect
# DB_USERNAME=your_username  
# DB_PASSWORD=your_password

# Setup database
php artisan migrate
php artisan db:seed

# Start server
php artisan serve
```

### **3. Mobile App Setup (2 minutes)**
```bash
cd mobile

# Install dependencies
npm install

# Start development server
npx expo start
```

### **4. Test Everything**
- **Backend**: Visit `http://localhost:8000/api` (should show API info)
- **Admin Panel**: Visit `http://localhost:8000/admin`
- **Mobile App**: Scan QR code with Expo Go app

## 🔧 Configuration Details

### **Backend Configuration (.env)**
```env
APP_NAME=EduConnect
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=educonnect
DB_USERNAME=root
DB_PASSWORD=your_password
```

### **Mobile App Configuration**
Update `mobile/constants/api.ts`:
```typescript
// For Android emulator
baseUrl = 'http://10.0.3.2:8000/api';

// For iOS simulator  
baseUrl = 'http://localhost:8000/api';

// For physical device
baseUrl = 'http://192.168.1.100:8000/api';
```

## 🧪 Test Credentials

After running `php artisan db:seed`, you can use:

### **Admin User**
- Email: `admin@educonnect.com`
- Password: `password`

### **Student User**
- Email: `student@educonnect.com`  
- Password: `password`

## 📱 Running on Different Platforms

### **Mobile App**
```bash
cd mobile

# iOS Simulator (macOS only)
npm run ios

# Android Emulator
npm run android

# Web Browser
npm run web

# Physical Device
# Install Expo Go app and scan QR code
```

### **Backend**
```bash
cd backend

# Development server
php artisan serve

# With custom host/port
php artisan serve --host=0.0.0.0 --port=8000
```

## 🔍 Verify Installation

### **Backend Health Check**
```bash
# Test API endpoint
curl http://localhost:8000/api/courses

# Test admin panel
open http://localhost:8000/admin
```

### **Mobile App Health Check**
1. Open Expo Go app
2. Scan QR code from terminal
3. App should load without errors
4. Try logging in with test credentials

## 🚨 Common Issues & Solutions

### **Backend Issues**

#### **Database Connection Error**
```bash
# Check database is running
mysql -u root -p

# Create database if needed
CREATE DATABASE educonnect;

# Clear config cache
php artisan config:clear
```

#### **Permission Errors**
```bash
# Fix storage permissions
chmod -R 775 storage bootstrap/cache
chown -R $USER:www-data storage bootstrap/cache
```

#### **Composer Issues**
```bash
# Clear composer cache
composer clear-cache

# Reinstall dependencies
rm -rf vendor composer.lock
composer install
```

### **Mobile App Issues**

#### **Metro Bundler Issues**
```bash
# Clear cache
npx expo start --clear

# Reset project
npm run reset-project
```

#### **API Connection Issues**
- Verify backend is running on `http://localhost:8000`
- Check API base URL in `constants/api.ts`
- Ensure correct IP for your platform

#### **Authentication Issues**
```bash
# Clear app storage
npm run reset-project

# Check backend authentication endpoints
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@educonnect.com","password":"password"}'
```

## 📚 Next Steps

After successful setup:

1. **Explore the Admin Panel**: `http://localhost:8000/admin`
2. **Test Mobile App**: Login and browse courses
3. **Read Documentation**: 
   - [Mobile App Guide](mobile/README.md)
   - [Backend Guide](backend/README.md)
   - [API Documentation](backend/API_DOCUMENTATION.md)
4. **Start Developing**: Make changes and see them live

## 🆘 Need Help?

If you encounter issues:

1. Check the troubleshooting sections in the main README files
2. Verify all prerequisites are installed correctly
3. Ensure both applications are running simultaneously
4. Check console/logs for error messages
5. Test with different devices/platforms

---

**Happy Coding! 🎉**

*EduConnect - Empowering education through technology* 