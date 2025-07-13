# University Course Management System

A REST API for managing university course offerings, student registrations, and results.

## Features

- **Student Management**: Create, read, update, delete students
- **Course Management**: Create, read, update, delete courses
- **Enrollment Management**: Enroll students in courses
- **Results Management**: Add grades and results for students in courses
- **Data Relationships**: View students' enrolled courses and courses' enrolled students

## Technology Stack

- **Spring Boot 3.5.3**
- **Spring Data JPA**
- **H2 Database** (in-memory)
- **Maven**

## Getting Started

### Prerequisites

- Java 17 or higher
- Maven 3.6 or higher

### Running the Application

1. Clone the repository
2. Navigate to the project directory
3. Run the application:

```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

### Database Console

Access the H2 database console at: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:testdb`
- Username: `sa`
- Password: `password`

## API Documentation

### Base URL
```
http://localhost:8080/api
```

### Student Endpoints

#### 1. Create Student
```http
POST /api/students
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@university.edu",
  "phoneNumber": "+1234567890",
  "studentId": "STU001"
}
```

#### 2. Get All Students
```http
GET /api/students
```

#### 3. Get Student by ID
```http
GET /api/students/{id}
```

#### 4. Update Student
```http
PUT /api/students/{id}
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@university.edu",
  "phoneNumber": "+1234567890",
  "studentId": "STU001"
}
```

#### 5. Delete Student
```http
DELETE /api/students/{id}
```

#### 6. Get Student Enrollments
```http
GET /api/students/{id}/enrollments
```

#### 7. Enroll Student in Course
```http
POST /api/students/{studentId}/enroll/{courseId}
```

### Course Endpoints

#### 1. Create Course
```http
POST /api/courses
Content-Type: application/json

{
  "courseCode": "CS101",
  "courseName": "Introduction to Computer Science",
  "description": "Basic concepts of programming and computer science",
  "credits": 3,
  "instructor": "Dr. Jane Smith",
  "maxStudents": 30
}
```

#### 2. Get All Courses
```http
GET /api/courses
```

#### 3. Get Course by ID
```http
GET /api/courses/{id}
```

#### 4. Update Course
```http
PUT /api/courses/{id}
Content-Type: application/json

{
  "courseCode": "CS101",
  "courseName": "Introduction to Computer Science",
  "description": "Updated description",
  "credits": 4,
  "instructor": "Dr. Jane Smith",
  "maxStudents": 35
}
```

#### 5. Delete Course
```http
DELETE /api/courses/{id}
```

#### 6. Get Course Enrollments (Students in Course)
```http
GET /api/courses/{id}/enrollments
```

#### 7. Add Result to Student in Course
```http
POST /api/courses/{courseId}/students/{studentId}/result
Content-Type: application/json

{
  "grade": 85.5,
  "gradeLetter": "B",
  "comments": "Good performance in assignments"
}
```

## Testing the API

### Using curl

#### 1. Create a Student
```bash
curl -X POST http://localhost:8080/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@university.edu",
    "phoneNumber": "+1234567890",
    "studentId": "STU001"
  }'
```

#### 2. Create a Course
```bash
curl -X POST http://localhost:8080/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "courseCode": "CS101",
    "courseName": "Introduction to Computer Science",
    "description": "Basic concepts of programming",
    "credits": 3,
    "instructor": "Dr. Jane Smith",
    "maxStudents": 30
  }'
```

#### 3. Enroll Student in Course
```bash
curl -X POST http://localhost:8080/api/students/1/enroll/1
```

#### 4. Get All Students
```bash
curl -X GET http://localhost:8080/api/students
```

#### 5. Get All Courses
```bash
curl -X GET http://localhost:8080/api/courses
```

#### 6. Get Student Enrollments
```bash
curl -X GET http://localhost:8080/api/students/1/enrollments
```

#### 7. Get Course Enrollments
```bash
curl -X GET http://localhost:8080/api/courses/1/enrollments
```

#### 8. Add Result
```bash
curl -X POST http://localhost:8080/api/courses/1/students/1/result \
  -H "Content-Type: application/json" \
  -d '{
    "grade": 85.5,
    "gradeLetter": "B",
    "comments": "Good performance"
  }'
```

### Using Postman

1. Import the following collection or create requests manually
2. Set base URL to `http://localhost:8080/api`
3. Use the JSON examples above for request bodies

## Data Model

### Student
- `id`: Primary key
- `firstName`: Student's first name
- `lastName`: Student's last name
- `email`: Unique email address
- `phoneNumber`: Contact phone number
- `studentId`: Unique student identifier

### Course
- `id`: Primary key
- `courseCode`: Unique course code
- `courseName`: Course name
- `description`: Course description
- `credits`: Number of credits
- `instructor`: Course instructor
- `maxStudents`: Maximum number of students allowed

### Enrollment
- `id`: Primary key
- `student`: Reference to Student
- `course`: Reference to Course
- `enrollmentDate`: Date of enrollment
- `status`: Enrollment status (ENROLLED, DROPPED, COMPLETED)
- `grade`: Numeric grade
- `gradeLetter`: Letter grade (A, B, C, D, F)
- `comments`: Additional comments

## Error Handling

The API returns appropriate HTTP status codes:
- `200 OK`: Successful operation
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Validation Rules

- Email addresses must be unique
- Student IDs must be unique
- Course codes must be unique
- Students cannot be enrolled in the same course twice
- Courses cannot be deleted if students are enrolled
- Course capacity cannot be exceeded 