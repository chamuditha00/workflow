import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import StudentList from './components/Students/StudentList';
import StudentForm from './components/Students/StudentForm';
import CourseList from './components/Courses/CourseList';
import CourseForm from './components/Courses/CourseForm';
import EnrollmentList from './components/Enrollments/EnrollmentList';
import EnrollmentForm from './components/Enrollments/EnrollmentForm';
import StudentProfile from './components/Students/StudentProfile';
import CourseDetails from './components/Courses/CourseDetails';
import Login from './components/Login';
import Register from './components/Register';
import FirstTimeLogin from './components/FirstTimeLogin';
import StudentDashboard from './components/StudentDashboard';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  // Role-based route protection
  const isLecturer = user?.role === 'lecturer';
  const isStudent = user?.role === 'student';

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/first-time-login" element={<FirstTimeLogin setUser={setUser} />} />
        {/* Student-only dashboard */}
        <Route path="/student" element={isStudent ? <StudentDashboard user={user} /> : <Navigate to="/login" replace />} />
        {/* Lecturer and authenticated dashboard */}
        <Route path="/dashboard" element={isLecturer ? <Layout><Dashboard /></Layout> : <Navigate to="/login" replace />} />
        {/* Lecturer-only routes */}
        {isLecturer && (
          <>
            <Route path="/students" element={<Layout><StudentList /></Layout>} />
            <Route path="/students/new" element={<Layout><StudentForm /></Layout>} />
            <Route path="/students/:id/edit" element={<Layout><StudentForm /></Layout>} />
            <Route path="/students/:id" element={<Layout><StudentProfile /></Layout>} />
            <Route path="/courses" element={<Layout><CourseList /></Layout>} />
            <Route path="/courses/new" element={<Layout><CourseForm /></Layout>} />
            <Route path="/courses/:id/edit" element={<Layout><CourseForm /></Layout>} />
            <Route path="/courses/:id" element={<Layout><CourseDetails /></Layout>} />
            <Route path="/enrollments" element={<Layout><EnrollmentList /></Layout>} />
            <Route path="/enrollments/new" element={<Layout><EnrollmentForm /></Layout>} />
          </>
        )}
        {/* Default route */}
        <Route path="*" element={<Navigate to={user ? (isLecturer ? "/dashboard" : "/student") : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
