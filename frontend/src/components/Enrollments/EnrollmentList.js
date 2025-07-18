import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  BookOpen, 
  Users,
  GraduationCap,
  Calendar,
  Eye
} from 'lucide-react';
import { getAllStudents, getAllCourses, enrollStudent, getStudent, getCourse } from '../../services/api';

const EnrollmentList = () => {
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEnrollments, setFilteredEnrollments] = useState([]);
  const [enrollModal, setEnrollModal] = useState({ show: false, studentId: '', courseId: '' });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = enrollments.filter(enrollment => {
      const studentName = `${enrollment.student?.firstName} ${enrollment.student?.lastName}`.toLowerCase();
      const courseName = enrollment.course?.courseName?.toLowerCase();
      const searchLower = searchTerm.toLowerCase();
      
      return studentName.includes(searchLower) || 
             courseName?.includes(searchLower) ||
             enrollment.student?.email?.toLowerCase().includes(searchLower);
    });
    setFilteredEnrollments(filtered);
  }, [searchTerm, enrollments]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [studentsRes, coursesRes] = await Promise.all([
        getAllStudents(),
        getAllCourses()
      ]);

      const studentsData = studentsRes.data;
      const coursesData = coursesRes.data;

      // Fetch enrollments for each student
      const enrollmentPromises = studentsData.map(async (student) => {
        try {
          const enrollmentsRes = await getStudent(student.id);
          return enrollmentsRes.data.enrollments.map(enrollment => ({
            ...enrollment,
            student,
            course: coursesData.find(c => c.id === enrollment.courseId)
          }));
        } catch (error) {
          console.error(`Error fetching enrollments for student ${student.id}:`, error);
          return [];
        }
      });

      const allEnrollments = await Promise.all(enrollmentPromises);
      const flatEnrollments = allEnrollments.flat();
      
      setStudents(studentsData);
      setCourses(coursesData);
      setEnrollments(flatEnrollments);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    try {
      await enrollStudent(enrollModal.studentId, enrollModal.courseId);
      await fetchData(); // Refresh data
      setEnrollModal({ show: false, studentId: '', courseId: '' });
    } catch (error) {
      console.error('Error enrolling student:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary shadow-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between animate-fade-in-up">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Enrollments</h1>
          <p className="text-text-secondary text-lg">Manage student course enrollments</p>
        </div>
        <button
          onClick={() => navigate('/enrollments/new')}
          className="btn btn-primary mt-6 sm:mt-0"
        >
          <Plus className="h-5 w-5" />
          New Enrollment
        </button>
      </div>

      {/* Search */}
      <div className="relative animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted h-5 w-5" />
        <input
          type="text"
          placeholder="Search enrollments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input pl-12"
        />
      </div>

      {/* Enrollments Table */}
      <div className="card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-600">
            <thead className="bg-dark-tertiary">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-text-primary uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-text-primary uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-text-primary uppercase tracking-wider">
                  Enrollment Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-text-primary uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-text-primary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {filteredEnrollments.map((enrollment, index) => (
                <tr key={`${enrollment.studentId}-${enrollment.courseId}`} 
                    className="hover:bg-dark-tertiary transition-colors animate-fade-in-up"
                    style={{ animationDelay: `${0.3 + index * 0.05}s` }}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-lg">
                          <Users className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-text-primary">
                          {enrollment.student?.firstName} {enrollment.student?.lastName}
                        </div>
                        <div className="text-sm text-text-muted">
                          {enrollment.student?.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-secondary to-accent flex items-center justify-center shadow-lg">
                          <BookOpen className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-text-primary">
                          {enrollment.course?.courseName}
                        </div>
                        <div className="text-sm text-text-muted">
                          {enrollment.course?.courseCode}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-accent" />
                      {enrollment.enrollmentDate ? 
                        new Date(enrollment.enrollmentDate).toLocaleDateString() : 
                        'N/A'
                      }
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`badge ${
                      enrollment.status === 'ENROLLED' ? 'badge-primary' :
                      enrollment.status === 'COMPLETED' ? 'badge-success' :
                      'badge-warning'
                    }`}>
                      {enrollment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => window.open(`/students/${enrollment.studentId}`, '_blank')}
                        className="btn btn-accent btn-sm"
                        title="View Student"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredEnrollments.length === 0 && (
        <div className="text-center py-16 animate-fade-in-up">
          <div className="text-text-muted mb-6">
            <GraduationCap className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-2xl font-bold text-text-primary mb-3">
            {searchTerm ? 'No enrollments found' : 'No enrollments yet'}
          </h3>
          <p className="text-text-secondary mb-6 text-lg">
            {searchTerm 
              ? 'Try adjusting your search terms'
              : 'Get started by enrolling students in courses'
            }
          </p>
          {!searchTerm && (
            <button
              onClick={() => navigate('/enrollments/new')}
              className="btn btn-primary"
            >
              <Plus className="h-5 w-5" />
              New Enrollment
            </button>
          )}
        </div>
      )}

      {/* Enrollment Modal */}
      {enrollModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in-up">
          <div className="card max-w-lg w-full mx-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold gradient-text mb-2">
                    New Enrollment
                  </h3>
                  <p className="text-text-secondary">
                    Enroll a student in a course
                  </p>
                </div>
                <button
                  onClick={() => setEnrollModal({ show: false, studentId: '', courseId: '' })}
                  className="text-text-muted hover:text-text-primary transition-colors p-2 hover:bg-dark-tertiary rounded-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="form-group">
                  <label className="form-label flex items-center">
                    <Users className="h-4 w-4 mr-2 text-accent" />
                    Student *
                  </label>
                  <select
                    value={enrollModal.studentId}
                    onChange={(e) => setEnrollModal(prev => ({ ...prev, studentId: e.target.value }))}
                    className="input"
                  >
                    <option value="">Select a student</option>
                    {students.map(student => (
                      <option key={student.id} value={student.id}>
                        {student.firstName} {student.lastName} ({student.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label flex items-center">
                    <BookOpen className="h-4 w-4 mr-2 text-accent" />
                    Course *
                  </label>
                  <select
                    value={enrollModal.courseId}
                    onChange={(e) => setEnrollModal(prev => ({ ...prev, courseId: e.target.value }))}
                    className="input"
                  >
                    <option value="">Select a course</option>
                    {courses.filter(course => course.status === 'ACTIVE').map(course => (
                      <option key={course.id} value={course.id}>
                        {course.courseName} ({course.courseCode})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex space-x-4 mt-8">
                <button
                  onClick={() => setEnrollModal({ show: false, studentId: '', courseId: '' })}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEnroll}
                  disabled={!enrollModal.studentId || !enrollModal.courseId}
                  className="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <GraduationCap className="h-4 w-4" />
                  Enroll Student
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnrollmentList; 