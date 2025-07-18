import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, BookOpen, Hash, FileText, Clock, DollarSign } from 'lucide-react';
import { getCourse, createCourse, updateCourse } from '../../services/api';

const CourseForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    courseName: '',
    courseCode: '',
    description: '',
    credits: '',
    instructor: '',
    maxStudents: '',
    status: 'ACTIVE'
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing) {
      fetchCourse();
    }
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await getCourse(id);
      const course = response.data;
      
      setFormData({
        courseName: course.courseName || '',
        courseCode: course.courseCode || '',
        description: course.description || '',
        credits: course.credits?.toString() || '',
        instructor: course.instructor || '',
        maxStudents: course.maxStudents?.toString() || '',
        status: course.status || 'ACTIVE'
      });
    } catch (error) {
      console.error('Error fetching course:', error);
      navigate('/courses');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.courseName.trim()) {
      newErrors.courseName = 'Course name is required';
    }

    if (!formData.courseCode.trim()) {
      newErrors.courseCode = 'Course code is required';
    }

    if (formData.credits && (isNaN(formData.credits) || formData.credits < 0)) {
      newErrors.credits = 'Credits must be a positive number';
    }

    if (!formData.instructor.trim()) {
      newErrors.instructor = 'Instructor is required';
    }

    if (formData.maxStudents && (isNaN(formData.maxStudents) || formData.maxStudents < 0)) {
      newErrors.maxStudents = 'Max students must be a positive number';
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
      
      const courseData = {
        ...formData,
        credits: formData.credits ? parseInt(formData.credits) : null,
        maxStudents: formData.maxStudents ? parseInt(formData.maxStudents) : null
      };

      if (isEditing) {
        await updateCourse(id, courseData);
      } else {
        await createCourse(courseData);
      }

      navigate('/courses');
    } catch (error) {
      console.error('Error saving course:', error);
      if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  if (loading && isEditing) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center animate-fade-in-up">
        <button
          onClick={() => navigate('/courses')}
          className="btn btn-secondary mr-6"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">
            {isEditing ? 'Edit Course' : 'Add New Course'}
          </h1>
          <p className="text-text-secondary text-lg">
            {isEditing ? 'Update course information' : 'Create a new course'}
          </p>
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

        <div className="card animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="p-8">
            <h2 className="text-xl font-bold text-text-primary mb-8 flex items-center">
              <BookOpen className="h-6 w-6 mr-3 text-accent" />
              Course Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label htmlFor="courseName" className="form-label">Course Name *</label>
                <input
                  type="text"
                  id="courseName"
                  name="courseName"
                  value={formData.courseName}
                  onChange={handleChange}
                  className={`input ${errors.courseName ? 'border-red-500' : ''}`}
                  placeholder="Enter course name"
                />
                {errors.courseName && (
                  <p className="text-red-400 text-sm mt-2">{errors.courseName}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="courseCode" className="form-label flex items-center">
                  <Hash className="h-4 w-4 mr-2 text-accent" />
                  Course Code *
                </label>
                <input
                  type="text"
                  id="courseCode"
                  name="courseCode"
                  value={formData.courseCode}
                  onChange={handleChange}
                  className={`input ${errors.courseCode ? 'border-red-500' : ''}`}
                  placeholder="e.g., CS101"
                />
                {errors.courseCode && (
                  <p className="text-red-400 text-sm mt-2">{errors.courseCode}</p>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label flex items-center">
                <FileText className="h-4 w-4 mr-2 text-accent" />
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="input resize-none"
                placeholder="Enter course description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="form-group">
                <label htmlFor="credits" className="form-label flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-accent" />
                  Credits
                </label>
                <input
                  type="number"
                  id="credits"
                  name="credits"
                  value={formData.credits}
                  onChange={handleChange}
                  className={`input ${errors.credits ? 'border-red-500' : ''}`}
                  placeholder="3"
                  min="0"
                />
                {errors.credits && (
                  <p className="text-red-400 text-sm mt-2">{errors.credits}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="instructor" className="form-label">Instructor *</label>
                <input
                  type="text"
                  id="instructor"
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleChange}
                  className={`input ${errors.instructor ? 'border-red-500' : ''}`}
                  placeholder="Enter instructor name"
                />
                {errors.instructor && (
                  <p className="text-red-400 text-sm mt-2">{errors.instructor}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="maxStudents" className="form-label">Max Students</label>
                <input
                  type="number"
                  id="maxStudents"
                  name="maxStudents"
                  value={formData.maxStudents}
                  onChange={handleChange}
                  className={`input ${errors.maxStudents ? 'border-red-500' : ''}`}
                  placeholder="30"
                  min="0"
                />
                {errors.maxStudents && (
                  <p className="text-red-400 text-sm mt-2">{errors.maxStudents}</p>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="status" className="form-label">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="input"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <button
            type="button"
            onClick={() => navigate('/courses')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="h-5 w-5" />
            )}
            {loading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Course' : 'Create Course')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseForm; 