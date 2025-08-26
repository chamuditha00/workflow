# University Course Management System

A full-stack application for managing university courses, students, and enrollments with a Spring Boot backend and React frontend.

## Features

- **Course Management**: Create, read, update, and delete courses
- **Student Management**: Manage student information and profiles
- **Enrollment System**: Handle course enrollments and registrations
- **RESTful API**: Backend API built with Spring Boot
- **Modern UI**: React frontend with Tailwind CSS

## Quick Start with Docker

### Prerequisites
- Docker
- Docker Compose

### Running the Application

1. **Clone the repository**
   ```bash
   git clone https://github.com/chamuditha00/university-course-management-system.git
   cd university-course-management-system
   ```

2. **Start the application with Docker Compose**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Backend API: http://localhost:8080
   - Frontend: http://localhost:3000 
   - MySQL Database: localhost:3306

### Database Configuration

The application uses MySQL with the following default configuration:
- **Database**: `university_db`
- **Username**: `university_user`
- **Password**: `university_password`
- **Port**: `3306`

## Running Without Docker

### Steps to Run

1. **Set up the Database**
   ```bash
   # Create MySQL database and user
   mysql -u root -p
   ```
   Then in MySQL prompt:
   ```sql
   CREATE DATABASE university_db;
   CREATE USER 'university_user'@'localhost' IDENTIFIED BY 'university_password';
   GRANT ALL PRIVILEGES ON university_db.* TO 'university_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

2. **Run the Backend**
   ```bash
   cd backend
   ./mvnw clean install
   ./mvnw spring-boot:run
   ```
   The backend will start on http://localhost:8080

3. **Run the Frontend**
   ```bash
   cd frontend
   npm install
   npm start
   ```
   The frontend will start on http://localhost:3000
