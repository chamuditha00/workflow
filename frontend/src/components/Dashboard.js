import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  TrendingUp,
  Plus,
  Eye,
  ArrowRight,
  Calendar,
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAllStudents, getAllCourses } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    students: 0,
    courses: 0,
    enrollments: 0,
    avgGrade: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentStudents, setRecentStudents] = useState([]);
  const [recentCourses, setRecentCourses] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [studentsRes, coursesRes] = await Promise.all([
          getAllStudents(),
          getAllCourses()
        ]);

        const students = studentsRes.data;
        const courses = coursesRes.data;

        setStats({
          students: students.length,
          courses: courses.length,
          enrollments: students.reduce((acc, student) => acc + (student.enrollments?.length || 0), 0),
          avgGrade: 85.5 // Mock average grade
        });

        setRecentStudents(students.slice(0, 5));
        setRecentCourses(courses.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, href }) => {
    const content = (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
        <div className="flex items-center">
          <div className={`p-3 rounded-lg ${color} shadow-sm`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
          {href && (
            <ArrowRight className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </div>
    );

    return href ? (
      <Link to={href} className="block group">
        {content}
      </Link>
    ) : content;
  };

  const QuickActionCard = ({ title, description, icon: Icon, href, color }) => (
    <Link to={href} className="block group">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
        <div className={`p-3 rounded-lg ${color} w-fit mb-4 shadow-sm`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </Link>
  );

  const RecentItem = ({ item, type, href }) => (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex items-center space-x-3">
        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
          type === 'student' ? 'bg-blue-100' : 'bg-green-100'
        }`}>
          {type === 'student' ? (
            <Users className="h-4 w-4 text-blue-600" />
          ) : (
            <BookOpen className="h-4 w-4 text-green-600" />
          )}
        </div>
        <div>
          <p className="font-medium text-gray-900 text-sm">
            {type === 'student' 
              ? `${item.firstName} ${item.lastName}`
              : item.courseName
            }
          </p>
          <p className="text-xs text-gray-500">
            {type === 'student' ? item.email : item.courseCode}
          </p>
        </div>
      </div>
      <Link
        to={href}
        className="text-primary hover:text-primary-dark text-xs font-medium flex items-center space-x-1"
      >
        <span>View</span>
        <Eye className="h-3 w-3" />
      </Link>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome to the Course Management System</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Students"
          value={stats.students}
          icon={Users}
          color="bg-blue-500"
          href="/students"
        />
        <StatCard
          title="Total Courses"
          value={stats.courses}
          icon={BookOpen}
          color="bg-green-500"
          href="/courses"
        />
        <StatCard
          title="Total Enrollments"
          value={stats.enrollments}
          icon={GraduationCap}
          color="bg-purple-500"
          href="/enrollments"
        />

      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickActionCard
            title="Add New Student"
            description="Register a new student in the system"
            icon={Plus}
            href="/students/new"
            color="bg-blue-500"
          />
          <QuickActionCard
            title="Create New Course"
            description="Add a new course to the curriculum"
            icon={BookOpen}
            href="/courses/new"
            color="bg-green-500"
          />
          <QuickActionCard
            title="View Enrollments"
            description="Manage student course enrollments"
            icon={Eye}
            href="/enrollments"
            color="bg-purple-500"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Students */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Students</h3>
              <Link
                to="/students"
                className="text-primary hover:text-primary-dark text-sm font-medium flex items-center space-x-1"
              >
                <span>View all</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
          <div className="p-4">
            {recentStudents.length > 0 ? (
              <div className="space-y-2">
                {recentStudents.map((student) => (
                  <RecentItem
                    key={student.id}
                    item={student}
                    type="student"
                    href={`/students/${student.id}`}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No students found</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Courses */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Courses</h3>
              <Link
                to="/courses"
                className="text-primary hover:text-primary-dark text-sm font-medium flex items-center space-x-1"
              >
                <span>View all</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
          <div className="p-4">
            {recentCourses.length > 0 ? (
              <div className="space-y-2">
                {recentCourses.map((course) => (
                  <RecentItem
                    key={course.id}
                    item={course}
                    type="course"
                    href={`/courses/${course.id}`}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No courses found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 