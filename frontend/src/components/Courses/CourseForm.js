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
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/courses')}
          className="btn btn-secondary mr-4"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Edit Course' : 'Add New Course'}
          </h1>
          <p className="mt-2 text-gray-600">
            {isEditing ? 'Update course information' : 'Create a new course'}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{errors.general}</p>
          </div>
        )}

        <div className="card">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Course Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <p className="text-red-500 text-sm mt-1">{errors.courseName}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="courseCode" className="form-label">Course Code *</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    id="courseCode"
                    name="courseCode"
                    value={formData.courseCode}
                    onChange={handleChange}
                    className={`input pl-10 ${errors.courseCode ? 'border-red-500' : ''}`}
                    placeholder="e.g., CS101"
                  />
                </div>
                {errors.courseCode && (
                  <p className="text-red-500 text-sm mt-1">{errors.courseCode}</p>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">Description</label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="input pl-10 resize-none"
                  placeholder="Enter course description"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="form-group">
                <label htmlFor="credits" className="form-label">Credits</label>
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
                  <p className="text-red-500 text-sm mt-1">{errors.credits}</p>
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
                  <p className="text-red-500 text-sm mt-1">{errors.instructor}</p>
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
                  <p className="text-red-500 text-sm mt-1">{errors.maxStudents}</p>
                )}
              </div>
            </div>
            {/* Status Dropdown */}
            <div className="form-group mt-4">
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
        <div className="flex justify-end space-x-3">
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
            className="btn btn-primary"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isEditing ? 'Update Course' : 'Create Course'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseForm; 