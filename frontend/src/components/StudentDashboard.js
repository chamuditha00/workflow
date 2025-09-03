import React, { useEffect, useState } from 'react';
import { BookOpen, TrendingUp, GraduationCap } from 'lucide-react';
import { getAllStudents } from '../services/api';

const StudentDashboard = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const studentsRes = await getAllStudents();
        const student = studentsRes.data.find(s => s.email === user.email);
        if (student && student.enrollments) {
          // Create course objects from enrollment data
          const coursesData = student.enrollments.map(e => ({
            id: e.courseId,
            courseName: e.courseName,
            courseCode: e.courseCode
          }));
          setCourses(coursesData);
          
          // Create grades data from enrollment data
          const gradesData = student.enrollments.map(e => ({
            course: e.courseName,
            grade: e.grade,
            gradeLetter: e.gradeLetter
          }));
          setGrades(gradesData);
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudentData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary shadow-lg"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-primary via-dark-secondary to-dark-tertiary">
      {/* Header */}
      <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 glass-light border-b border-gray-600 px-4 shadow-lg sm:gap-x-6 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <GraduationCap className="h-8 w-8 text-primary animate-glow" />
          <span className="ml-2 text-xl font-bold gradient-text">CourseFlow</span>
        </div>
        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <div className="flex flex-1 items-center justify-end">
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block">
                <span className="text-sm text-text-muted">Welcome back, {user.name || 'Student'}!</span>
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center status-online">
                <span className="text-white font-semibold text-sm">{user.name ? user.name.charAt(0).toUpperCase() : 'S'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <h1 className="text-4xl font-bold gradient-text mb-2">My Courses & Grades</h1>
            <div className="card p-6 mb-6">
              <h2 className="text-xl font-bold gradient-text mb-4">Assigned Courses</h2>
              {courses.length > 0 ? (
                <ul className="space-y-2">
                  {courses.map((course, idx) => (
                    <li key={course.id || idx} className="flex items-center space-x-3">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <span className="font-semibold text-text-primary">{course.courseName}</span>
                      <span className="text-text-muted">({course.courseCode})</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-text-muted">No assigned courses.</p>
              )}
            </div>
            <div className="card p-6">
              <h2 className="text-xl font-bold gradient-text mb-4">Grades</h2>
              {grades.length > 0 ? (
                <ul className="space-y-2">
                  {grades.map((g, idx) => (
                    <li key={idx} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <TrendingUp className="h-5 w-5 text-accent" />
                        <span className="font-semibold text-text-primary">{g.course}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-text-muted">
                          Grade: {g.grade || 'N/A'} {g.gradeLetter && `(${g.gradeLetter})`}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-text-muted">No grades available.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
