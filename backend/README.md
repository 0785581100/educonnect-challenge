# 🏗️ EduConnect Backend API

A Laravel-based REST API backend for the EduConnect e-learning platform. This backend provides authentication, course management, enrollment tracking, and administrative features through a robust API with Filament admin panel.

## 🚀 Features

### **Core API Features**
- **User Authentication**: JWT-based authentication with Laravel Sanctum
- **Course Management**: CRUD operations for courses with instructor relationships
- **Enrollment System**: Student enrollment tracking with progress monitoring
- **User Management**: Role-based user system (admin, instructor, student)
- **Progress Tracking**: Enrollment progress percentage tracking
- **Admin Panel**: Filament-based administrative interface

### **Security Features**
- **JWT Authentication**: Secure token-based authentication
- **CORS Support**: Cross-origin resource sharing configuration
- **Input Validation**: Comprehensive request validation
- **Role-Based Access**: User role management and permissions
- **Password Hashing**: Secure password storage with bcrypt

### **Database Features**
- **Eloquent ORM**: Laravel's powerful ORM for database operations
- **Migrations**: Version-controlled database schema
- **Seeders**: Sample data generation for development
- **Relationships**: Proper foreign key relationships
- **Indexing**: Optimized database queries

## 🛠 Tech Stack

### **Core Technologies**
- **Laravel**: 8.x (PHP Framework)
- **PHP**: 7.3+ or 8.0+
- **MySQL/PostgreSQL**: Database
- **Laravel Sanctum**: API Authentication

### **Key Dependencies**
- **Filament**: Admin panel framework
- **Laravel CORS**: Cross-origin resource sharing
- **Guzzle HTTP**: HTTP client library
- **Faker**: Data generation for testing

### **Development Tools**
- **Artisan CLI**: Laravel command-line interface
- **Composer**: PHP dependency management
- **PHPUnit**: Testing framework
- **Sail**: Docker development environment

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

### **Required Software**
- **PHP**: Version 7.3 or higher (8.0+ recommended)
- **Composer**: PHP package manager
- **MySQL/PostgreSQL**: Database server
- **Node.js**: For frontend assets (optional)
- **Git**: Version control

### **PHP Extensions**
```bash
# Required PHP extensions
php-bcmath
php-curl
php-json
php-mbstring
php-mysql
php-xml
php-zip
```

## 🚀 Installation & Setup

### **1. Clone the Repository**
```bash
git clone <repository-url>
cd educonnect-challenge/backend
```

### **2. Install Dependencies**
```bash
composer install
```

### **3. Environment Configuration**

Copy the environment file and configure your settings:

```bash
cp .env.example .env
```

Edit `.env` file with your database and application settings:

```env
APP_NAME=EduConnect
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=educonnect
DB_USERNAME=root
DB_PASSWORD=

CACHE_DRIVER=file
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120
```

### **4. Generate Application Key**
```bash
php artisan key:generate
```

### **5. Database Setup**

#### **Create Database**
```sql
CREATE DATABASE educonnect;
```

#### **Run Migrations**
```bash
php artisan migrate
```

#### **Seed Database (Optional)**
```bash
php artisan db:seed
```

### **6. Start the Development Server**
```bash
# Start Laravel development server
php artisan serve

# Or specify host and port
php artisan serve --host=0.0.0.0 --port=8000
```

### **7. Access the Application**
- **API Base URL**: `http://localhost:8000/api`
- **Admin Panel**: `http://localhost:8000/admin`
- **API Documentation**: See `API_DOCUMENTATION.md`

## 📁 Project Structure

### **Directory Organization**
```
backend/
├── app/
│   ├── Console/           # Artisan commands
│   ├── Exceptions/        # Exception handlers
│   ├── Filament/          # Admin panel resources
│   │   ├── Pages/         # Admin pages
│   │   └── Resources/     # Admin resources
│   ├── Http/
│   │   ├── Controllers/   # API controllers
│   │   │   └── Api/       # API-specific controllers
│   │   └── Middleware/    # HTTP middleware
│   ├── Models/            # Eloquent models
│   └── Providers/         # Service providers
├── config/                # Configuration files
├── database/
│   ├── factories/         # Model factories
│   ├── migrations/        # Database migrations
│   └── seeders/           # Database seeders
├── routes/
│   └── api.php           # API routes
├── storage/               # File storage
└── tests/                 # Test files
```

### **Key Files**
- `routes/api.php` - API route definitions
- `app/Http/Controllers/Api/` - API controllers
- `app/Models/` - Eloquent models
- `database/migrations/` - Database schema
- `config/cors.php` - CORS configuration

## 🔧 Configuration

### **Database Configuration**
Configure your database connection in `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=educonnect
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### **CORS Configuration**
Update `config/cors.php` for frontend integration:

```php
'allowed_origins' => ['http://localhost:3000', 'http://localhost:8081'],
'allowed_methods' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
'allowed_headers' => ['Content-Type', 'Authorization', 'Accept'],
```

### **API Configuration**
- **Base URL**: `http://localhost:8000/api`
- **Authentication**: Bearer token (Laravel Sanctum)
- **Content-Type**: `application/json`

## 🗄️ Database Schema

### **Core Tables**

#### **Users Table**
```sql
- id (Primary Key)
- name (VARCHAR)
- email (VARCHAR, Unique)
- password (VARCHAR)
- role (ENUM: admin, instructor, student)
- created_at, updated_at
```

#### **Courses Table**
```sql
- id (Primary Key)
- title (VARCHAR)
- description (TEXT)
- price (DECIMAL)
- instructor_id (Foreign Key -> users.id)
- status (ENUM: active, inactive)
- created_at, updated_at
```

#### **Enrollments Table**
```sql
- id (Primary Key)
- user_id (Foreign Key -> users.id)
- course_id (Foreign Key -> courses.id)
- progress_percentage (DECIMAL)
- enrolled_at (TIMESTAMP)
- created_at, updated_at
```

### **Relationships**
- **User** has many **Courses** (as instructor)
- **User** has many **Enrollments**
- **Course** belongs to **User** (instructor)
- **Course** has many **Enrollments**
- **Enrollment** belongs to **User** and **Course**

## 🔐 Authentication System

### **Laravel Sanctum**
- **Token-based authentication**
- **Automatic token management**
- **Secure token storage**
- **Token expiration handling**

### **User Roles**
- **Admin**: Full system access
- **Instructor**: Course management
- **Student**: Course enrollment and learning

### **API Authentication Flow**
1. User registers/logs in via `/api/auth/register` or `/api/auth/login`
2. Server returns JWT token
3. Client includes token in `Authorization: Bearer {token}` header
4. Server validates token for protected routes

## 📊 Admin Panel (Filament)

### **Access Admin Panel**
- **URL**: `http://localhost:8000/admin`
- **Default Admin**: Created via seeder
- **Features**: Full CRUD operations for all entities

### **Admin Features**
- **User Management**: Create, edit, delete users
- **Course Management**: Manage courses and instructors
- **Enrollment Tracking**: View and manage enrollments
- **Statistics Dashboard**: System overview and analytics

### **Creating Admin User**
```bash
# Via seeder
php artisan db:seed --class=UserSeeder

# Or manually via tinker
php artisan tinker
User::create(['name' => 'Admin', 'email' => 'admin@educonnect.com', 'password' => Hash::make('password'), 'role' => 'admin']);
```

## 🧪 Testing

### **Running Tests**
```bash
# Run all tests
php artisan test

# Run specific test file
php artisan test tests/Feature/AuthTest.php

# Run with coverage
php artisan test --coverage
```

### **Test Structure**
- `tests/Feature/` - Feature tests
- `tests/Unit/` - Unit tests
- `tests/TestCase.php` - Base test class

### **API Testing**
```bash
# Test API endpoints
php artisan test --filter=ApiTest
```

## 🚀 Deployment

### **Production Setup**

#### **1. Environment Configuration**
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com

DB_CONNECTION=mysql
DB_HOST=your-db-host
DB_DATABASE=your-db-name
DB_USERNAME=your-db-user
DB_PASSWORD=your-db-password
```

#### **2. Optimize Application**
```bash
# Cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Optimize autoloader
composer install --optimize-autoloader --no-dev
```

#### **3. Set Permissions**
```bash
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

### **Docker Deployment**
```bash
# Using Laravel Sail
./vendor/bin/sail up -d

# Or custom Docker setup
docker-compose up -d
```

## 🔧 Maintenance

### **Database Maintenance**
```bash
# Backup database
php artisan db:backup

# Clear cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Optimize database
php artisan migrate:optimize
```

### **Log Management**
```bash
# View logs
tail -f storage/logs/laravel.log

# Clear logs
php artisan log:clear
```

## 📚 API Documentation

### **Base URL**
```
http://localhost:8000/api
```

### **Authentication Endpoints**
- `POST /auth/register` - User registration
- `POST /auth/login` - User authentication

### **Course Endpoints**
- `GET /courses` - List all courses
- `GET /courses/{id}` - Get course details
- `POST /courses/{id}/enroll` - Enroll in course

### **User Endpoints**
- `GET /my-courses` - Get user's enrolled courses
- `GET /user` - Get current user profile

### **Detailed Documentation**
See `API_DOCUMENTATION.md` for complete API reference with request/response examples.

## 🔧 Troubleshooting

### **Common Issues**

#### **Database Connection**
```bash
# Test database connection
php artisan tinker
DB::connection()->getPdo();

# Clear config cache
php artisan config:clear
```

#### **Permission Issues**
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

### **Development Tips**
- Use `php artisan serve` for development
- Enable debug mode in `.env` for detailed errors
- Check `storage/logs/laravel.log` for error logs
- Use `php artisan route:list` to see all routes

## 🤝 Contributing

### **Development Workflow**
1. Create feature branch
2. Implement changes with tests
3. Follow PSR-12 coding standards
4. Submit pull request

### **Code Standards**
- Follow PSR-12 coding standards
- Write tests for new features
- Use meaningful commit messages
- Document API changes

## 📄 License

This project is part of the EduConnect e-learning platform.

## 🆘 Support

For technical support or questions:
- Check the troubleshooting section
- Review API documentation
- Check Laravel logs
- Verify database connectivity

---

**EduConnect Backend API** - Powering the future of education 🎓✨
