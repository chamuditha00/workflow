import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  BookOpen, 
  Award, 
  Calendar,
  ArrowLeft,
  GraduationCap,
  Star,
  Users,
  TrendingUp,
  Clock,
  Edit,
  ExternalLink
} from 'lucide-react';
import { getStudent } from '../../services/api';

const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const response = await getStudent(id);
        setStudent(response.data);
      } catch (error) {
        console.error('Error fetching student:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-16">
        <div className="text-gray-400 mb-6">
          <User className="h-16 w-16 mx-auto" />
        </div>
        <h3 className="text-xl font-medium text-gray-900 mb-3">Student Not Found</h3>
        <p className="text-gray-500">The student you're looking for doesn't exist.</p>
      </div>
    );
  }

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
    if (!student.enrollments || student.enrollments.length === 0) return 0;
    const grades = student.enrollments
      .filter(enr => enr.grade !== null)
      .map(enr => enr.grade);
    return grades.length > 0 ? (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(1) : 0;
  };

  const getCompletedCourses = () => {
    return student.enrollments?.filter(enr => enr.status === 'COMPLETED').length || 0;
  };

  const getActiveEnrollments = () => {
    return student.enrollments?.filter(enr => enr.status === 'ENROLLED').length || 0;
  };


  return (
    <div className="space-y-10 max-w-4xl mx-auto p-6 animate-fade-in-up">
      {/* Header with Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between animate-fade-in-up">
        <div className="flex items-center space-x-6">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-secondary btn-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Student Profile</h1>
            <p className="text-text-secondary text-lg">View student information and enrolled courses</p>
          </div>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button className="btn btn-secondary btn-sm">
            <Edit className="h-4 w-4" />
            Edit
          </button>
        </div>
      </div>

      {/* Student Information Card */}
      <div className="card glass-light hover-lift transition-all duration-300 p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/40 to-teal-100/20 pointer-events-none rounded-3xl" />
        <div className="flex items-start space-x-8 relative z-10">
          <div className="flex-shrink-0">
            <div className="h-28 w-28 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-xl border-4 border-white">
              <User className="h-14 w-14 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-6">
              <h2 className="text-4xl font-bold text-gray-900">
                {student.firstName} {student.lastName}
              </h2>
              <span className="px-4 py-2 bg-emerald-100 text-emerald-800 text-sm font-semibold rounded-full border border-emerald-200 shadow-sm">
                Active Student
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-4 p-4 bg-white/80 rounded-xl border border-slate-200 shadow-sm">
                <Mail className="h-6 w-6 text-emerald-400" />
                <span className="text-gray-700 font-medium">{student.email}</span>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-white/80 rounded-xl border border-slate-200 shadow-sm">
                <Phone className="h-6 w-6 text-emerald-400" />
                <span className="text-gray-700 font-medium">{student.phoneNumber}</span>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-white/80 rounded-xl border border-slate-200 shadow-sm">
                <GraduationCap className="h-6 w-6 text-emerald-400" />
                <span className="text-blue-600 font-bold">ID: {student.studentId}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center my-6">
        <div className="flex-grow border-t border-emerald-200" />
        <span className="mx-4 text-emerald-400 font-semibold tracking-wide uppercase text-xs">Overview</span>
        <div className="flex-grow border-t border-emerald-200" />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-fade-in-up">
        <div className="card glass-light hover-lift p-6 flex flex-col items-center text-center">
          <BookOpen className="h-8 w-8 text-emerald-500 mb-2" />
          <span className="text-2xl font-bold text-gray-900">{student.enrollments?.length || 0}</span>
          <span className="text-sm text-text-secondary mt-1">Total Courses</span>
        </div>
        <div className="card glass-light hover-lift p-6 flex flex-col items-center text-center">
          <Award className="h-8 w-8 text-emerald-500 mb-2" />
          <span className="text-2xl font-bold text-gray-900">{getCompletedCourses()}</span>
          <span className="text-sm text-text-secondary mt-1">Completed</span>
        </div>
        <div className="card glass-light hover-lift p-6 flex flex-col items-center text-center">
          <Star className="h-8 w-8 text-emerald-500 mb-2" />
          <span className="text-2xl font-bold text-gray-900">{calculateAverageGrade()}%</span>
          <span className="text-sm text-text-secondary mt-1">Average Grade</span>
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center my-6">
        <div className="flex-grow border-t border-emerald-200" />
        <span className="mx-4 text-emerald-400 font-semibold tracking-wide uppercase text-xs">Courses</span>
        <div className="flex-grow border-t border-emerald-200" />
      </div>

      {/* Stats Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="card bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-8 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm font-semibold mb-2">Total Courses</p>
              <p className="text-3xl font-bold">{student.enrollments?.length || 0}</p>
            </div>
            <BookOpen className="h-10 w-10 text-indigo-200" />
          </div>
        </div>
        <div className="card bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-8 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-semibold mb-2">Completed</p>
              <p className="text-3xl font-bold">{getCompletedCourses()}</p>
            </div>
            <Award className="h-10 w-10 text-emerald-200" />
          </div>
        </div>
        <div className="card bg-gradient-to-r from-purple-500 to-purple-600 text-white p-8 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-semibold mb-2">Average Grade</p>
              <p className="text-3xl font-bold">{calculateAverageGrade()}%</p>
            </div>
            <TrendingUp className="h-10 w-10 text-purple-200" />
          </div>
        </div>
      </div> */}

      {/* Enrolled Courses */}
      <div className="card glass-light hover-lift p-8 animate-fade-in-up">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-indigo-500 rounded-xl shadow-lg">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold gradient-text">Enrolled Courses</h3>
              <p className="text-text-secondary mt-1">Manage and view course progress</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Users className="h-5 w-5 text-gray-400" />
            <span className="text-gray-500 font-medium">
              {student.enrollments?.length || 0} courses
            </span>
          </div>
        </div>

        {student.enrollments && student.enrollments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {student.enrollments.map((enrollment) => (
              <div
                key={enrollment.courseId}
                className="card glass-light hover-lift border-2 border-emerald-400 rounded-2xl p-8 cursor-pointer group animate-fade-in-up transition-transform duration-200 hover:scale-[1.03] hover:shadow-emerald-300/60 hover:shadow-2xl relative overflow-hidden bg-gradient-to-br from-white via-emerald-50 to-white"
                onClick={() => navigate(`/courses/${enrollment.courseId}`)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/60 to-white/0 pointer-events-none rounded-2xl z-0" />
                <div className="flex items-start justify-between mb-6 relative z-10">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg border-2 border-white">
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-emerald-700 text-xl group-hover:text-emerald-600 transition-colors drop-shadow-sm">
                        {enrollment.courseName}
                      </h4>
                      <p className="text-blue-600 font-bold text-xs mt-1">
                        {enrollment.courseCode}
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="h-5 w-5 text-gray-300 group-hover:text-emerald-500 transition-colors" />
                </div>

                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-emerald-300" />
                      <span className="text-gray-600 font-medium text-sm">
                        {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                      </span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-md border-2 ${
                      enrollment.status === 'ENROLLED' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      enrollment.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      'bg-gray-50 text-gray-700 border-gray-200'
                    }`}>
                      {enrollment.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-3">
                      {enrollment.grade !== null ? (
                        <>
                          <div className={`p-2 rounded-full ${getGradeBackground(enrollment.grade)} border border-gray-200`}>
                            <Star className={`h-5 w-5 ${getGradeColor(enrollment.grade)}`} />
                          </div>
                          <span className={`font-bold text-base ${getGradeColor(enrollment.grade)}`}>
                            {enrollment.grade}%
                          </span>
                        </>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Clock className="h-5 w-5 text-gray-300" />
                          <span className="text-gray-400 font-semibold text-sm">No grade yet</span>
                        </div>
                      )}
                    </div>
                    <Award className="h-5 w-5 text-emerald-300" />
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  {enrollment.status === 'COMPLETED' && (
                    <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full shadow-sm border border-emerald-200">Completed</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-6">
              <BookOpen className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-3">No Enrolled Courses</h3>
            <p className="text-gray-500 mb-6">This student is not enrolled in any courses yet.</p>
            <button className="btn btn-primary px-6 py-3 text-lg font-semibold">
              <BookOpen className="h-5 w-5" />
              Enroll in Course
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProfile; 