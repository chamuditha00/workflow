import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  BookOpen,
  Users,
  Clock,
  GraduationCap,
  Hash,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { getAllCourses, deleteCourse } from '../../services/api';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ show: false, course: null });
  const [deletingCourse, setDeletingCourse] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    const filtered = courses.filter(course =>
      course.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.courseCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [searchTerm, courses]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await getAllCourses();
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setErrorMessage('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId) => {
    try {
      setDeletingCourse(courseId);
      await deleteCourse(courseId);
      
      // Remove the course from the local state
      setCourses(courses.filter(course => course.id !== courseId));
      
      // Show success message
      setSuccessMessage(`Course "${deleteModal.course?.courseName}" deleted successfully!`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
      // Close the modal
      setDeleteModal({ show: false, course: null });
    } catch (error) {
      console.error('Error deleting course:', error);
      
      // Show error message based on the error
      if (error.response?.status === 400) {
        setErrorMessage('Cannot delete course. There are students enrolled in this course.');
      } else {
        setErrorMessage('Failed to delete course. Please try again.');
      }
      
      // Clear error message after 5 seconds
      setTimeout(() => {
        setErrorMessage('');
      }, 5000);
    } finally {
      setDeletingCourse(null);
    }
  };

  const confirmDelete = (course) => {
    setDeleteModal({ show: true, course });
  };

  const getEnrollmentCount = (course) => {
    return course.enrollments?.length || 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
          <p className="mt-2 text-gray-600">Manage course information and enrollments</p>
        </div>
        <Link
          to="/courses/new"
          className="btn btn-primary mt-4 sm:mt-0"
        >
          <Plus className="h-4 w-4" />
          Add Course
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input pl-10"
        />
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredCourses.map((course) => (
          <div key={course.id} className="card hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {course.courseName}
                      </h3>
                      <p className="text-sm text-gray-500">Code: {course.courseCode}</p>
                    </div>
                  </div>
                  {course.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mt-2">
                      {course.description}
                    </p>
                  )}
                </div>
                <div className="flex space-x-1 ml-4">
                  <Link
                    to={`/courses/${course.id}`}
                    className="btn btn-secondary btn-sm"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  <Link
                    to={`/courses/${course.id}/edit`}
                    className="btn btn-secondary btn-sm"
                    title="Edit Course"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => confirmDelete(course)}
                    className={`btn btn-sm ${
                      getEnrollmentCount(course) > 0 
                        ? 'btn-secondary opacity-50 cursor-not-allowed' 
                        : 'btn-danger'
                    }`}
                    title={getEnrollmentCount(course) > 0 
                      ? 'Cannot delete course with enrolled students' 
                      : 'Delete Course'
                    }
                    disabled={deletingCourse === course.id || getEnrollmentCount(course) > 0}
                  >
                    {deletingCourse === course.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {course.credits && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-3 text-gray-400" />
                    <span>{course.credits} credits</span>
                  </div>
                )}
                
                {course.instructor && (
                  <div className="flex items-center text-sm text-gray-600">
                    <GraduationCap className="h-4 w-4 mr-3 text-gray-400" />
                    <span className="truncate">{course.instructor}</span>
                  </div>
                )}

                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-3 text-gray-400" />
                  <span>{getEnrollmentCount(course)} students enrolled</span>
                  {getEnrollmentCount(course) > 0 && (
                    <span className="ml-2 px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                      Protected
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Hash className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Status:</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    course.status === 'ACTIVE' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {course.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <BookOpen className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No courses found' : 'No courses yet'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm 
              ? 'Try adjusting your search terms'
              : 'Get started by adding your first course'
            }
          </p>
          {!searchTerm && (
            <Link to="/courses/new" className="btn btn-primary">
              <Plus className="h-4 w-4" />
              Add Course
            </Link>
          )}
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-red-100 rounded-full mr-3">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Delete Course
              </h3>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-3">
                Are you sure you want to delete <strong>"{deleteModal.course?.courseName}"</strong>?
              </p>
              
              {getEnrollmentCount(deleteModal.course) > 0 ? (
                <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-amber-600 mr-2" />
                    <span className="text-amber-800 text-sm font-medium">
                      Warning: This course has {getEnrollmentCount(deleteModal.course)} enrolled students.
                    </span>
                  </div>
                  <p className="text-amber-700 text-xs mt-1">
                    You cannot delete a course that has enrolled students. Please remove all enrollments first.
                  </p>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  This action cannot be undone.
                </p>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setDeleteModal({ show: false, course: null })}
                className="btn btn-secondary flex-1"
                disabled={deletingCourse === deleteModal.course?.id}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteModal.course.id)}
                className="btn btn-danger flex-1"
                disabled={deletingCourse === deleteModal.course?.id || getEnrollmentCount(deleteModal.course) > 0}
              >
                {deletingCourse === deleteModal.course?.id ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </div>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span>{successMessage}</span>
          </div>
        </div>
      )}
      {errorMessage && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg z-50">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{errorMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseList; 