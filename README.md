# University Course Management System

A full-stack application for managing university courses, students, and enrollments with a Spring Boot backend and React frontend.

## Features

- **Course Management**: Create, read, update, and delete courses
- **Student Management**: Manage student information and profiles
- **Enrollment System**: Handle course enrollments and registrations
- **RESTful API**: Backend API built with Spring Boot
- **Modern UI**: React frontend with Tailwind CSS

## Technology Stack

### Backend
- Spring Boot 3.5.3
- Spring Data JPA
- MySQL 8.0
- Maven

### Frontend
- React 18
- Tailwind CSS
- Axios for API calls

### Infrastructure
- Docker & Docker Compose
- MySQL Database

## Quick Start with Docker

### Prerequisites
- Docker
- Docker Compose

### Running the Application

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd university-course-management-system
   ```

2. **Start the application with Docker Compose**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Backend API: http://localhost:8080
   - Frontend: http://localhost:3000 (if you add frontend to docker-compose)
   - MySQL Database: localhost:3306

### Database Configuration

The application uses MySQL with the following default configuration:
- **Database**: `university_db`
- **Username**: `university_user`
- **Password**: `university_password`
- **Port**: `3306`

### Environment Variables

You can customize the database configuration by setting these environment variables:

```bash
SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/university_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
SPRING_DATASOURCE_USERNAME=university_user
SPRING_DATASOURCE_PASSWORD=university_password
```

## Development Setup

### Backend Development

1. **Prerequisites**
   - Java 17
   - Maven
   - MySQL (or use Docker)

2. **Local Development**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

3. **Database Setup**
   - Install MySQL locally or use Docker
   - Create database: `university_db`
   - Update `application.properties` with your local MySQL credentials

### Frontend Development

1. **Prerequisites**
   - Node.js 16+
   - npm or yarn

2. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

## API Endpoints

### Courses
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create a new course
- `GET /api/courses/{id}` - Get course by ID
- `PUT /api/courses/{id}` - Update course
- `DELETE /api/courses/{id}` - Delete course

### Students
- `GET /api/students` - Get all students
- `POST /api/students` - Create a new student
- `GET /api/students/{id}` - Get student by ID
- `PUT /api/students/{id}` - Update student
- `DELETE /api/students/{id}` - Delete student

### Enrollments
- `GET /api/enrollments` - Get all enrollments
- `POST /api/enrollments` - Create a new enrollment
- `GET /api/enrollments/{id}` - Get enrollment by ID
- `PUT /api/enrollments/{id}` - Update enrollment
- `DELETE /api/enrollments/{id}` - Delete enrollment

## Docker Commands

### Useful Docker Commands

```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs

# View logs for specific service
docker-compose logs backend
docker-compose logs mysql

# Rebuild and start
docker-compose up --build

# Remove volumes (will delete database data)
docker-compose down -v
```

### Database Management

```bash
# Connect to MySQL container
docker exec -it university-mysql mysql -u university_user -p

# Backup database
docker exec university-mysql mysqldump -u university_user -p university_db > backup.sql

# Restore database
docker exec -i university-mysql mysql -u university_user -p university_db < backup.sql
```

## Project Structure

```
university-course-management-system/
├── backend/                 # Spring Boot application
│   ├── src/main/java/      # Java source code
│   ├── src/main/resources/ # Configuration files
│   ├── Dockerfile          # Backend container definition
│   └── pom.xml            # Maven dependencies
├── frontend/               # React application
│   ├── src/               # React source code
│   ├── public/            # Static files
│   └── package.json       # Node.js dependencies
├── mysql/                 # MySQL initialization scripts
│   └── init/              # Database initialization
├── docker-compose.yml     # Multi-container setup
└── README.md             # This file
```

## Troubleshooting

### Common Issues

1. **Port conflicts**: Make sure ports 8080 and 3306 are available
2. **Database connection**: Wait for MySQL to fully start before the backend tries to connect
3. **Permission issues**: Ensure Docker has proper permissions to create volumes

### Logs and Debugging

```bash
# Check if containers are running
docker ps

# Check container logs
docker-compose logs

# Access MySQL directly
docker exec -it university-mysql mysql -u university_user -p university_db

# Check application logs
docker-compose logs backend
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License. 