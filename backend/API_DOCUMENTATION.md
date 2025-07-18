# 📚 EduConnect API Documentation

## Authentication

All endpoints (except `/api/auth/login`, `/api/auth/register`, `/api/auth/forgot-password`, `/api/auth/reset-password`) require a Bearer token (Laravel Sanctum).  
Obtain a token via the login or register endpoint, then include it in the `Authorization` header:

```
Authorization: Bearer {token}
```

---

## 1. **POST** `/api/auth/register`

**Description:** Register a new user and receive a token.

**Request:**
```json
POST /api/auth/register
Content-Type: application/json

{
  "name": "Alice Student",
  "email": "alice2@educonnect.com",
  "password": "password",
  "password_confirmation": "password",
  "role": "student" // optional, defaults to student
}
```

**Response (201):**
```json
{
  "user": {
    "id": 12,
    "name": "Alice Student",
    "email": "alice2@educonnect.com",
    "role": "student"
  },
  "token": "1|xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

**Response (422):**
```json
{
  "message": "The email has already been taken.",
  "errors": {
    "email": ["The email has already been taken."]
  }
}
```

---

## 2. **POST** `/api/auth/login`

**Description:** Authenticate user and receive a token.

**Request:**
```json
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@educonnect.com",
  "password": "password"
}
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@educonnect.com",
    "role": "admin"
  },
  "token": "1|xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

**Response (401):**
```json
{
  "message": "Invalid credentials."
}
```

---

## 3. **POST** `/api/auth/forgot-password`

**Description:** Send a password reset link to the user's email.

**Request:**
```json
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "alice2@educonnect.com"
}
```

**Response (200):**
```json
{
  "message": "Password reset link sent."
}
```

**Response (422):**
```json
{
  "message": "The selected email is invalid.",
  "errors": {
    "email": ["The selected email is invalid."]
  }
}
```

---

## 4. **POST** `/api/auth/reset-password`

**Description:** Reset the user's password using the token sent to their email.

**Request:**
```json
POST /api/auth/reset-password
Content-Type: application/json

{
  "email": "alice2@educonnect.com",
  "token": "reset-token-from-email",
  "password": "newpassword",
  "password_confirmation": "newpassword"
}
```

**Response (200):**
```json
{
  "message": "Password has been reset."
}
```

**Response (400):**
```json
{
  "message": "Invalid token or email."
}
```

---

## 5. **GET** `/api/courses`

**Description:** List all active courses (paginated).

**Headers:**  
`Authorization: Bearer {token}`

**Request:**
```
GET /api/courses?per_page=10
```

**Response (200):**
```json
{
  "current_page": 1,
  "data": [
    {
      "id": 1,
      "title": "Introduction to Web Development",
      "description": "...",
      "price": "99.99",
      "instructor_id": 1,
      "status": "active",
      "created_at": "...",
      "updated_at": "...",
      "instructor": {
        "id": 1,
        "name": "Admin User",
        "email": "admin@educonnect.com",
        "role": "admin"
      }
    }
    // ...
  ],
  "first_page_url": "...",
  "last_page": 1,
  "last_page_url": "...",
  "per_page": 10,
  "total": 5
}
```

---

## 6. **GET** `/api/courses/{id}`

**Description:** Get details for a specific course.

**Headers:**  
`Authorization: Bearer {token}`

**Request:**
```
GET /api/courses/1
```

**Response (200):**
```json
{
  "id": 1,
  "title": "Introduction to Web Development",
  "description": "...",
  "price": "99.99",
  "instructor_id": 1,
  "status": "active",
  "created_at": "...",
  "updated_at": "...",
  "instructor": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@educonnect.com",
    "role": "admin"
  },
  "enrollments": [
    {
      "id": 1,
      "user_id": 3,
      "course_id": 1,
      "progress_percentage": "75.50",
      "enrolled_at": "...",
      "created_at": "...",
      "updated_at": "...",
      "user": {
        "id": 3,
        "name": "Alice Student",
        "email": "alice@educonnect.com",
        "role": "student"
      }
    }
    // ...
  ]
}
```

**Response (404):**
```json
{
  "message": "Course not found."
}
```

---

## 7. **POST** `/api/courses/{id}/enroll`

**Description:** Enroll the authenticated user in a course.

**Headers:**  
`Authorization: Bearer {token}`

**Request:**
```
POST /api/courses/1/enroll
```

**Response (200):**
```json
{
  "message": "Enrolled successfully.",
  "enrollment": {
    "id": 10,
    "user_id": 3,
    "course_id": 1,
    "progress_percentage": "0.00",
    "enrolled_at": "...",
    "created_at": "...",
    "updated_at": "..."
  }
}
```

**Response (409):**
```json
{
  "message": "Already enrolled in this course."
}
```

**Response (404):**
```json
{
  "message": "Course not found."
}
```

---

## 8. **GET** `/api/my-courses`

**Description:** List all courses the authenticated user is enrolled in, with progress.

**Headers:**  
`Authorization: Bearer {token}`

**Request:**
```
GET /api/my-courses
```

**Response (200):**
```json
[
  {
    "id": 1,
    "title": "Introduction to Web Development",
    "description": "...",
    "price": "99.99",
    "instructor_id": 1,
    "status": "active",
    "created_at": "...",
    "updated_at": "...",
    "progress_percentage": "75.50",
    "enrolled_at": "2024-07-01T12:00:00.000000Z"
  }
  // ...
]
```

---

## 9. **GET** `/api/user`

**Description:** Get the authenticated user's info.

**Headers:**  
`Authorization: Bearer {token}`

**Response (200):**
```json
{
  "id": 3,
  "name": "Alice Student",
  "email": "alice@educonnect.com",
  "role": "student"
  // ...
}
```

---

## Error Responses

- **401 Unauthorized:** Missing or invalid token.
- **404 Not Found:** Resource does not exist.
- **409 Conflict:** Already enrolled in course.
- **422 Unprocessable Entity:** Validation errors.
- **400 Bad Request:** Invalid token or email for password reset. 