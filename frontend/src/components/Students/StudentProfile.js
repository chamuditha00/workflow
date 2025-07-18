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
            <h1 className="text-4xl font-bold text-gray-900">Student Profile</h1>
            <p className="mt-3 text-gray-600 text-lg">View student information and enrolled courses</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="btn btn-secondary btn-sm hover:shadow-lg transition-all duration-200 px-4 py-2">
            <Edit className="h-4 w-4" />
            Edit
          </button>
        </div>
      </div>

      {/* Student Information Card */}
      <div className="card hover:shadow-xl transition-all duration-300 p-8">
        <div className="flex items-start space-x-8">
          <div className="flex-shrink-0">
            <div className="h-28 w-28 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl">
              <User className="h-14 w-14 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-6">
              <h2 className="text-4xl font-bold text-gray-900">
                {student.firstName} {student.lastName}
              </h2>
              <span className="px-4 py-2 bg-emerald-100 text-emerald-800 text-sm font-semibold rounded-full border border-emerald-200">
                Active Student
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <Mail className="h-6 w-6 text-slate-500" />
                <span className="text-gray-700 font-medium">{student.email}</span>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <Phone className="h-6 w-6 text-slate-500" />
                <span className="text-gray-700 font-medium">{student.phoneNumber}</span>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <GraduationCap className="h-6 w-6 text-slate-500" />
                <span className="text-gray-700 font-medium">ID: {student.studentId}</span>
              </div>
            </div>
          </div>
        </div>
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
      <div className="card p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-indigo-500 rounded-xl shadow-lg">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Enrolled Courses</h3>
              <p className="text-gray-600 mt-1">Manage and view course progress</p>
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
                className="border border-gray-200 rounded-2xl p-8 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 cursor-pointer bg-white group"
                onClick={() => navigate(`/courses/${enrollment.courseId}`)}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg">
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg group-hover:text-indigo-600 transition-colors">
                        {enrollment.courseName}
                      </h4>
                      <p className="text-gray-500 font-medium">
                        {enrollment.courseCode}
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-600 font-medium">
                        {new Date(enrollment.enrollmentDate).toLocaleDateString()}
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
                          <Clock className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-400 font-medium">No grade yet</span>
                        </div>
                      )}
                    </div>
                    <Award className="h-5 w-5 text-gray-400" />
                  </div>
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