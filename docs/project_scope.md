Build "EduConnect" - a simplified learning management system using Filament
Laravel (backend) and Expo React Native (mobile app). 
Build "EduConnect" - a simplified learning management system using Filament
Laravel (backend) and Expo React Native (mobile app). This challenge tests your ability
to create the type of e-learning platforms you'll manage at our organisation



Part 1: Backend (Filament Laravel)
Required Features
Database Models & Relationships
- Users: name, email, role (admin/student), timestamps
- Courses: title, description, price, instructor_id, status
- Enrollments: user_id, course_id, progress_percentage, enrolled_at
API Endpoints
POST /api/auth/login # User authentication
GET /api/courses # List courses with pagination
GET /api/courses/{id} # Course details
POST /api/courses/{id}/enroll # Enroll in course
GET /api/my-courses # User's enrolled courses
Filament Admin Panel
- Dashboard with basic statistics (total users, courses, enrollments)
- Course management (create, edit, delete courses)
- User management (view users, enrollments)
- Simple analytics (enrollment trends)
Technical Requirements
- Laravel Sanctum for API authentication
- Proper validation and error handling
- Database migrations and seeders
- Basic unit tests for API endpoints
Part 2: Mobile App (Expo React Native)
Required Features
Core Screens
- Login/Register: User authentication
- Course List: Browse available courses with search
- Course Detail: Course information and enrollment
- My Courses: Enrolled courses with progress
- Profile: User information and logout
Key Functionality
- User authentication with token storage
- Course browsing and enrollment
- Progress tracking display
- Responsive design for phones and tablets
- Basic error handling and loading states
Technical Requirements
- React Navigation for screen management
- API integration with Laravel backend
- AsyncStorage for token persistence
- Clean, professional UI design


Evaluation Criteria (100 points)
Backend Assessment (50 points)
• Laravel Implementation (15 pts): Proper use of Laravel features, code
organization
• Filament Admin Panel (15 pts): Functional admin interface with good UX
• API Design (10 pts): RESTful endpoints with proper responses
• Database Design (10 pts): Efficient schema and relationships
Mobile Assessment (40 points)
• React Native/Expo (15 pts): Proper component structure and navigation
• UI/UX Design (15 pts): Clean, intuitive interface
• API Integration (10 pts): Successful backend communication
Code Quality (10 points)
• Organization (5 pts): Clean code structure and naming
• Documentation (5 pts): README with setup instructions
Bonus Points (up to 10 points)
• Advanced features (offline support, push notifications)
• Comprehensive testing
• Deployment configuration
Submission Requirements
Repository Structure
educonnect-challenge/
├── README.md
├── backend/ # Laravel + Filament
├── mobile/ # Expo React Native
└── docs/ # Screenshots and documentation
Documentation
• README.md: Project overview, setup instructions, technology stack
• API Documentation: Endpoint list with examples
• Screenshots: Key features of both admin panel and mobile app
Minimum Viable Product
Backend MVP:
- Working Filament admin panel
- Functional API endpoints
- User authentication system
Mobile MVP:
- User login/registration
- Course listing and details
- Enrollment functionality
- Basic navigation
Timeline & Submission
Recommended Schedule:
- Days 1-2: Laravel setup, database design, basic API
- Days 3-4: Filament admin panel implementation
- Days 5-6: Mobile app development and API integration
- Day 7: Testing, documentation, final polish
Submission:
1. Email GitHub repository URL with your submission
2. Include brief explanation (max 200 words) of your approach and key decisions
Evaluation Process:
- Code review and functionality testing
- Technical interview discussing your implementation
- Final scoring and candidate ranking
