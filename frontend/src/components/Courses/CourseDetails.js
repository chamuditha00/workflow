import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  Award, 
  Calendar,
  ArrowLeft,
  GraduationCap,
  Star,
  Save,
  Edit3,
  Clock,
  Hash,
  Eye,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { getCourse, updateGrade } from '../../services/api';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gradeInputs, setGradeInputs] = useState({});
  const [savingGrades, setSavingGrades] = useState({});
  const [successMessages, setSuccessMessages] = useState({});
  const [errorMessages, setErrorMessages] = useState({});

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await getCourse(id);
        setCourse(response.data);
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const handleGradeChange = (enrollmentId, value) => {
    setGradeInputs(inputs => ({ ...inputs, [enrollmentId]: value }));
  };

  const handleGradeSave = async (enrollmentId) => {
    const grade = gradeInputs[enrollmentId];
    if (!grade || grade.trim() === '') return;

    try {
      setSavingGrades(prev => ({ ...prev, [enrollmentId]: true }));
      await updateGrade(enrollmentId, parseFloat(grade));
      
      // Show success message
      setSuccessMessages(prev => ({ ...prev, [enrollmentId]: `Grade ${grade} saved successfully!` }));
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessages(prev => {
          const newMessages = { ...prev };
          delete newMessages[enrollmentId];
          return newMessages;
        });
      }, 3000);
      
      // Refresh course data
      const response = await getCourse(id);
      setCourse(response.data);
      
      // Clear the input for this enrollment
      setGradeInputs(inputs => {
        const newInputs = { ...inputs };
        delete newInputs[enrollmentId];
        return newInputs;
      });
    } catch (error) {
      console.error('Error updating grade:', error);
      // Show error message
      setErrorMessages(prev => ({ ...prev, [enrollmentId]: `Failed to save grade: ${error.message}` }));
      
      // Clear error message after 5 seconds
      setTimeout(() => {
        setErrorMessages(prev => {
          const newMessages = { ...prev };
          delete newMessages[enrollmentId];
          return newMessages;
        });
      }, 5000);
    } finally {
      setSavingGrades(prev => ({ ...prev, [enrollmentId]: false }));
    }
  };

  const getGradeColor = (grade) => {
    if (!grade) return 'text-gray-400';
    if (grade >= 90) return 'text-emerald-600';
    if (grade >= 80) return 'text-blue-600';
    if (grade >= 70) return 'text-amber-600';
    return 'text-red-600';
  };

  const getGradeBackground = (grade) => {
    if (!grade) return 'bg-gray-100';
    if (grade >= 90) return 'bg-emerald-100';
    if (grade >= 80) return 'bg-blue-100';
    if (grade >= 70) return 'bg-amber-100';
    return 'bg-red-100';
  };

  const calculateAverageGrade = () => {
    if (!course.enrollments || course.enrollments.length === 0) return 0;
    const grades = course.enrollments
      .filter(enr => enr.grade !== null)
      .map(enr => enr.grade);
    return grades.length > 0 ? (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(1) : 0;
  };

  const getCompletedStudents = () => {
    return course.enrollments?.filter(enr => enr.status === 'COMPLETED').length || 0;
  };

  const getActiveStudents = () => {
    return course.enrollments?.filter(enr => enr.status === 'ENROLLED').length || 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-16">
        <div className="text-gray-400 mb-6">
          <BookOpen className="h-16 w-16 mx-auto" />
        </div>
        <h3 className="text-xl font-medium text-gray-900 mb-3">Course Not Found</h3>
        <p className="text-gray-500">The course you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 p-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-secondary btn-sm hover:shadow-lg transition-all duration-200 px-4 py-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Course Details</h1>
            <p className="mt-3 text-gray-600 text-lg">Manage course information and student grades</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="btn btn-secondary btn-sm hover:shadow-lg transition-all duration-200 px-4 py-2">
            <Edit3 className="h-4 w-4" />
            Edit
          </button>
        </div>
      </div>

      {/* Course Information Card */}
      <div className="card hover:shadow-xl transition-all duration-300 p-8">
        <div className="flex items-start space-x-8">
          <div className="flex-shrink-0">
            <div className="h-28 w-28 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-xl">
              <BookOpen className="h-14 w-14 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-6">
              <h2 className="text-4xl font-bold text-gray-900">
                {course.courseName}
              </h2>
              <span className={`px-4 py-2 text-sm font-semibold rounded-full border ${
                course.status === 'ACTIVE' 
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                  : 'bg-gray-100 text-gray-800 border-gray-200'
              }`}>
                {course.status === 'ACTIVE' ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="text-gray-600 mb-6 text-lg">{course.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <Hash className="h-6 w-6 text-slate-500" />
                <span className="text-gray-700 font-medium">{course.courseCode}</span>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <GraduationCap className="h-6 w-6 text-slate-500" />
                <span className="text-gray-700 font-medium">{course.instructor}</span>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <Clock className="h-6 w-6 text-slate-500" />
                <span className="text-gray-700 font-medium">{course.credits} credits</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enrolled Students */}
      <div className="card p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-emerald-500 rounded-xl shadow-lg">
              <Users className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Enrolled Students</h3>
              <p className="text-gray-600 mt-1">Manage grades and track progress</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Eye className="h-5 w-5 text-gray-400" />
            <span className="text-gray-500 font-medium">
              {course.enrollments?.length || 0} students
            </span>
          </div>
        </div>

        {course.enrollments && course.enrollments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {course.enrollments.map((enrollment) => (
              <div
                key={enrollment.id}
                className="border border-gray-200 rounded-2xl p-8 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 bg-white"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">
                        {enrollment.studentName}
                      </h4>
                      <p className="text-gray-500 font-medium">
                        Student ID: {enrollment.studentId}
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="h-5 w-5 text-gray-400" />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-600 font-medium">
                        Enrolled: {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                      </span>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      enrollment.status === 'ENROLLED' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                      enrollment.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                      'bg-gray-100 text-gray-800 border border-gray-200'
                    }`}>
                      {enrollment.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-3">
                        {enrollment.grade !== null ? (
                          <>
                            <div className={`p-3 rounded-full ${getGradeBackground(enrollment.grade)} border border-gray-200`}>
                              <Star className={`h-5 w-5 ${getGradeColor(enrollment.grade)}`} />
                            </div>
                            <span className={`font-bold text-lg ${getGradeColor(enrollment.grade)}`}>
                              {enrollment.grade}%
                            </span>
                          </>
                        ) : (
                          <div className="flex items-center space-x-3">
                            <AlertCircle className="h-5 w-5 text-gray-400" />
                            <span className="text-gray-400 font-medium">No grade yet</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={gradeInputs[enrollment.id] || ''}
                        onChange={(e) => handleGradeChange(enrollment.id, e.target.value)}
                        placeholder="Grade"
                        className="w-24 px-4 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                      <button
                        onClick={() => handleGradeSave(enrollment.id)}
                        disabled={savingGrades[enrollment.id] || !gradeInputs[enrollment.id] || gradeInputs[enrollment.id].trim() === ''}
                        className={`btn btn-sm hover:shadow-lg transition-all duration-200 px-4 py-3 ${
                          savingGrades[enrollment.id] || !gradeInputs[enrollment.id] || gradeInputs[enrollment.id].trim() === ''
                            ? 'btn-secondary opacity-50 cursor-not-allowed'
                            : 'btn-primary'
                        }`}
                      >
                        {savingGrades[enrollment.id] ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {/* {!gradeInputs[enrollment.id] && (
                      <p className="text-xs text-gray-500 mt-1">Enter a grade (0-100) and click save</p>
                    )}
                    {successMessages[enrollment.id] && (
                      <p className="text-xs text-emerald-600 mt-1 font-medium">{successMessages[enrollment.id]}</p>
                    )}
                    {errorMessages[enrollment.id] && (
                      <p className="text-xs text-red-600 mt-1 font-medium">{errorMessages[enrollment.id]}</p>
                    )} */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-6">
              <Users className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-3">No Enrolled Students</h3>
            <p className="text-gray-500 mb-6">No students are enrolled in this course yet.</p>
            <button className="btn btn-primary px-6 py-3 text-lg font-semibold">
              <Users className="h-5 w-5" />
              Enroll Students
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetails; 