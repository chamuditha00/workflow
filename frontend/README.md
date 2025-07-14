# Course Management System - Frontend

A modern, responsive React application for managing university courses, students, and enrollments.

## Features

### 🎓 Dashboard
- Overview statistics (students, courses, enrollments)
- Quick action cards for common tasks
- Recent students and courses lists
- Real-time data visualization

### 👥 Student Management
- **Student List**: View all students with search and filtering
- **Add Student**: Create new student records with comprehensive forms
- **Edit Student**: Update student information
- **Delete Student**: Remove students with confirmation
- **Student Details**: View individual student information and enrollments

### 📚 Course Management
- **Course List**: Browse all courses with search functionality
- **Add Course**: Create new courses with detailed information
- **Edit Course**: Update course details
- **Delete Course**: Remove courses with confirmation
- **Course Details**: View course information and enrolled students

### 🎯 Enrollment Management
- **Enrollment List**: View all student-course enrollments
- **New Enrollment**: Enroll students in courses
- **Grade Management**: Add and update student grades
- **Search & Filter**: Find specific enrollments quickly

## Technology Stack

- **React 19** - Modern React with hooks
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API communication
- **Lucide React** - Beautiful, customizable icons
- **Tailwind CSS** - Utility-first CSS framework
- **Custom CSS** - Additional styling and design system

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on `http://localhost:8080`

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend/course-management-ui
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Integration

The frontend integrates with the following backend endpoints:

### Student Endpoints
- `GET /api/students` - Get all students
- `POST /api/students` - Create a new student
- `GET /api/students/{id}` - Get student by ID
- `PUT /api/students/{id}` - Update student
- `DELETE /api/students/{id}` - Delete student
- `GET /api/students/{id}/enrollments` - Get student enrollments
- `POST /api/students/{studentId}/enroll/{courseId}` - Enroll student in course

### Course Endpoints
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create a new course
- `GET /api/courses/{id}` - Get course by ID
- `PUT /api/courses/{id}` - Update course
- `DELETE /api/courses/{id}` - Delete course
- `GET /api/courses/{id}/enrollments` - Get course enrollments
- `POST /api/courses/{courseId}/students/{studentId}/result` - Add result

## Project Structure

```
src/
├── components/
│   ├── Layout.js              # Main layout with navigation
│   ├── Dashboard.js            # Dashboard component
│   ├── Students/
│   │   ├── StudentList.js      # Student listing and management
│   │   └── StudentForm.js      # Student creation/editing form
│   ├── Courses/
│   │   ├── CourseList.js       # Course listing and management
│   │   └── CourseForm.js       # Course creation/editing form
│   └── Enrollments/
│       └── EnrollmentList.js   # Enrollment management
├── services/
│   └── api.js                 # API service functions
├── App.js                     # Main app component with routing
├── index.js                   # Application entry point
└── index.css                  # Global styles and Tailwind CSS
```

## Design System

### Colors
- **Primary**: `#667eea` (Blue gradient)
- **Secondary**: `#764ba2` (Purple)
- **Success**: `#4ade80` (Green)
- **Warning**: `#fbbf24` (Yellow)
- **Error**: `#f87171` (Red)

### Components
- **Cards**: Clean, elevated containers
- **Buttons**: Consistent styling with hover effects
- **Forms**: Responsive input fields with validation
- **Modals**: Overlay dialogs for confirmations
- **Tables**: Data display with sorting and filtering

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Collapsible sidebar navigation
- Touch-friendly interface

## Features

### ✨ Modern UI/UX
- Clean, professional design
- Smooth animations and transitions
- Intuitive navigation
- Responsive layout for all devices

### 🔍 Search & Filter
- Real-time search across all entities
- Advanced filtering options
- Sortable data tables

### 📊 Data Management
- CRUD operations for all entities
- Bulk operations support
- Data validation and error handling
- Optimistic updates for better UX

### 🎯 User Experience
- Loading states and spinners
- Error handling with user-friendly messages
- Confirmation dialogs for destructive actions
- Form validation with real-time feedback

## Development

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

### Code Style

- ESLint configuration included
- Prettier formatting
- Component-based architecture
- Custom hooks for reusable logic

## Deployment

### Build for Production

```bash
npm run build
```

This creates a `build` folder with optimized production files.

### Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:8080/api
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is part of the University Course Management System.
