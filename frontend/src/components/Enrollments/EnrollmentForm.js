import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Users, 
  BookOpen, 
  GraduationCap,
  Calendar,
  User,
  CheckCircle
} from 'lucide-react';
import { getAllStudents, getAllCourses, enrollStudent } from '../../services/api';

const EnrollmentForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    studentId: '',
    courseId: '',
    enrollmentDate: new Date().toISOString().split('T')[0]
  });

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.studentId) {
      const student = students.find(s => s.id === parseInt(formData.studentId));
      setSelectedStudent(student);
    } else {
      setSelectedStudent(null);
    }
  }, [formData.studentId, students]);

  useEffect(() => {
    if (formData.courseId) {
      const course = courses.find(c => c.id === parseInt(formData.courseId));
      setSelectedCourse(course);
    } else {
      setSelectedCourse(null);
    }
  }, [formData.courseId, courses]);

  const fetchData = async () => {
    try {
      setDataLoading(true);
      const [studentsRes, coursesRes] = await Promise.all([
        getAllStudents(),
        getAllCourses()
      ]);

      setStudents(studentsRes.data);
      setCourses(coursesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrors({ general: 'Failed to load students and courses' });
    } finally {
      setDataLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.studentId) {
      newErrors.studentId = 'Please select a student';
    }

    if (!formData.courseId) {
      newErrors.courseId = 'Please select a course';
    }

    if (!formData.enrollmentDate) {
      newErrors.enrollmentDate = 'Please select an enrollment date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      await enrollStudent(formData.studentId, formData.courseId);
      navigate('/enrollments');
    } catch (error) {
      console.error('Error enrolling student:', error);
      if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({ general: 'Failed to enroll student. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user makes a selection
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary shadow-lg"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center animate-fade-in-up">
        <button
          onClick={() => navigate('/enrollments')}
          className="btn btn-secondary mr-6"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">New Enrollment</h1>
          <p className="text-text-secondary text-lg">Enroll a student in a course</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {errors.general && (
          <div className="card animate-fade-in-up">
            <div className="p-6 bg-gradient-to-r from-red-500/10 to-red-600/10 border-l-4 border-red-500">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-red-300">{errors.general}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Student Selection */}
        <div className="card animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="p-8">
            <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center">
              <Users className="h-6 w-6 mr-3 text-accent" />
              Select Student
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="form-group">
                <label htmlFor="studentId" className="form-label">
                  Student *
                </label>
                <select
                  id="studentId"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  className={`input ${errors.studentId ? 'border-red-500' : ''}`}
                >
                  <option value="">Select a student</option>
                  {students.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.firstName} {student.lastName} ({student.email})
                    </option>
                  ))}
                </select>
                {errors.studentId && (
                  <p className="text-red-400 text-sm mt-2">{errors.studentId}</p>
                )}
              </div>

              {selectedStudent && (
                <div className="glass-light rounded-xl p-6 animate-fade-in-up">
                  <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2 text-primary" />
                    Student Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-text-muted">Name:</span>
                      <span className="text-text-primary font-medium">
                        {selectedStudent.firstName} {selectedStudent.lastName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Email:</span>
                      <span className="text-text-primary">{selectedStudent.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Student ID:</span>
                      <span className="text-text-primary">{selectedStudent.studentId}</span>
                    </div>
                    {selectedStudent.phoneNumber && (
                      <div className="flex justify-between">
                        <span className="text-text-muted">Phone:</span>
                        <span className="text-text-primary">{selectedStudent.phoneNumber}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Course Selection */}
        <div className="card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="p-8">
            <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center">
              <BookOpen className="h-6 w-6 mr-3 text-accent" />
              Select Course
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="form-group">
                <label htmlFor="courseId" className="form-label">
                  Course *
                </label>
                <select
                  id="courseId"
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleChange}
                  className={`input ${errors.courseId ? 'border-red-500' : ''}`}
                >
                  <option value="">Select a course</option>
                  {courses.filter(course => course.status === 'ACTIVE').map(course => (
                    <option key={course.id} value={course.id}>
                      {course.courseName} ({course.courseCode})
                    </option>
                  ))}
                </select>
                {errors.courseId && (
                  <p className="text-red-400 text-sm mt-2">{errors.courseId}</p>
                )}
              </div>

              {selectedCourse && (
                <div className="glass-light rounded-xl p-6 animate-fade-in-up">
                  <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-secondary" />
                    Course Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-text-muted">Name:</span>
                      <span className="text-text-primary font-medium">{selectedCourse.courseName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Code:</span>
                      <span className="text-text-primary">{selectedCourse.courseCode}</span>
                    </div>
                    {selectedCourse.credits && (
                      <div className="flex justify-between">
                        <span className="text-text-muted">Credits:</span>
                        <span className="text-text-primary">{selectedCourse.credits}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-text-muted">Instructor:</span>
                      <span className="text-text-primary">{selectedCourse.instructor}</span>
                    </div>
                    {selectedCourse.maxStudents && (
                      <div className="flex justify-between">
                        <span className="text-text-muted">Max Students:</span>
                        <span className="text-text-primary">{selectedCourse.maxStudents}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-text-muted">Status:</span>
                      <span className={`badge ${
                        selectedCourse.status === 'ACTIVE' ? 'badge-success' : 'badge-warning'
                      }`}>
                        {selectedCourse.status}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enrollment Details */}
        <div className="card animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="p-8">
            <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center">
              <Calendar className="h-6 w-6 mr-3 text-accent" />
              Enrollment Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label htmlFor="enrollmentDate" className="form-label">
                  Enrollment Date *
                </label>
                <input
                  type="date"
                  id="enrollmentDate"
                  name="enrollmentDate"
                  value={formData.enrollmentDate}
                  onChange={handleChange}
                  className={`input ${errors.enrollmentDate ? 'border-red-500' : ''}`}
                />
                {errors.enrollmentDate && (
                  <p className="text-red-400 text-sm mt-2">{errors.enrollmentDate}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Summary */}
        {selectedStudent && selectedCourse && (
          <div className="card animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="p-8 bg-gradient-to-r from-primary/10 to-secondary/10 border-l-4 border-primary">
              <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center">
                <CheckCircle className="h-6 w-6 mr-3 text-primary" />
                Enrollment Summary
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">Student</h3>
                  <p className="text-text-secondary">
                    {selectedStudent.firstName} {selectedStudent.lastName}
                  </p>
                  <p className="text-text-muted text-sm">{selectedStudent.email}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">Course</h3>
                  <p className="text-text-secondary">{selectedCourse.courseName}</p>
                  <p className="text-text-muted text-sm">{selectedCourse.courseCode}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <button
            type="button"
            onClick={() => navigate('/enrollments')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !formData.studentId || !formData.courseId}
            className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            ) : (
              <GraduationCap className="h-5 w-5" />
            )}
            {loading ? 'Enrolling...' : 'Enroll Student'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EnrollmentForm;
