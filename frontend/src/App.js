import React from 'react';
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
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/students" element={<StudentList />} />
          <Route path="/students/new" element={<StudentForm />} />
          <Route path="/students/:id/edit" element={<StudentForm />} />
          <Route path="/students/:id" element={<StudentProfile />} />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/courses/new" element={<CourseForm />} />
          <Route path="/courses/:id/edit" element={<CourseForm />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/enrollments" element={<EnrollmentList />} />
          <Route path="/enrollments/new" element={<EnrollmentForm />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
