import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  TrendingUp,
  Plus,
  Eye,
  ArrowRight,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAllStudents, getAllCourses } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    students: 0,
    courses: 0,
    enrollments: 0,
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
      <div className="card hover-lift animate-fade-in-up">
        <div className="flex items-center p-6">
          <div className={`p-3 rounded-xl ${color} shadow-lg`}>
            <Icon className="h-7 w-7 text-white" />
          </div>
          <div className="ml-5 flex-1">
            <p className="text-sm font-semibold text-text-muted uppercase tracking-wide">{title}</p>
            <p className="text-3xl font-bold text-text-primary mt-1">{value}</p>
          </div>
          {href && (
            <ArrowRight className="h-5 w-5 text-text-muted group-hover:text-primary transition-colors" />
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
      <div className="card hover-lift animate-fade-in-up p-6">
        <div className={`p-4 rounded-xl ${color} w-fit mb-4 shadow-lg animate-glow`}>
          <Icon className="h-7 w-7 text-white" />
        </div>
        <h3 className="text-xl font-bold text-text-primary mb-3 gradient-text">{title}</h3>
        <p className="text-text-secondary">{description}</p>
      </div>
    </Link>
  );

  const RecentItem = ({ item, type, href }) => (
    <div className="flex items-center justify-between p-4 hover:bg-dark-tertiary rounded-xl transition-all duration-200 border border-transparent hover:border-gray-600">
      <div className="flex items-center space-x-4">
        <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
          type === 'student' ? 'bg-gradient-to-r from-primary to-primary-light' : 'bg-gradient-to-r from-secondary to-accent'
        } shadow-lg`}>
          {type === 'student' ? (
            <Users className="h-5 w-5 text-white" />
          ) : (
            <BookOpen className="h-5 w-5 text-white" />
          )}
        </div>
        <div>
          <p className="font-semibold text-text-primary">
            {type === 'student' 
              ? `${item.firstName} ${item.lastName}`
              : item.courseName
            }
          </p>
          <p className="text-sm text-text-muted">
            {type === 'student' ? item.email : item.courseCode}
          </p>
        </div>
      </div>
      <Link
        to={href}
        className="btn btn-secondary btn-sm flex items-center space-x-2"
      >
        <span>View</span>
        <Eye className="h-4 w-4" />
      </Link>
    </div>
  );

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
      <div className="animate-fade-in-up">
        <h1 className="text-4xl font-bold gradient-text mb-2">Dashboard</h1>
        <p className="text-text-secondary text-lg">Welcome to CourseFlow Management System</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Students"
          value={stats.students}
          icon={Users}
          color="bg-gradient-to-r from-primary to-primary-light"
          href="/students"
        />
        <StatCard
          title="Total Courses"
          value={stats.courses}
          icon={BookOpen}
          color="bg-gradient-to-r from-secondary to-accent"
          href="/courses"
        />
        <StatCard
          title="Total Enrollments"
          value={stats.enrollments}
          icon={GraduationCap}
          color="bg-gradient-to-r from-accent to-accent-dark"
          href="/enrollments"
        />
      </div>

      {/* Quick Actions */}
      <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-2xl font-bold gradient-text-accent mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickActionCard
            title="Add New Student"
            description="Register a new student in the system"
            icon={Plus}
            href="/students/new"
            color="bg-gradient-to-r from-primary to-primary-light"
          />
          <QuickActionCard
            title="Create New Course"
            description="Add a new course to the curriculum"
            icon={BookOpen}
            href="/courses/new"
            color="bg-gradient-to-r from-secondary to-accent"
          />
          <QuickActionCard
            title="View Enrollments"
            description="Manage student course enrollments"
            icon={Eye}
            href="/enrollments"
            color="bg-gradient-to-r from-accent to-accent-dark"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        {/* Recent Students */}
        <div className="card">
          <div className="px-6 py-5 border-b border-gray-600">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold gradient-text">Recent Students</h3>
              <Link
                to="/students"
                className="btn btn-secondary btn-sm flex items-center space-x-2"
              >
                <span>View all</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="p-6">
            {recentStudents.length > 0 ? (
              <div className="space-y-3">
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
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-text-muted mx-auto mb-4" />
                <p className="text-text-muted">No students found</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Courses */}
        <div className="card">
          <div className="px-6 py-5 border-b border-gray-600">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold gradient-text">Recent Courses</h3>
              <Link
                to="/courses"
                className="btn btn-secondary btn-sm flex items-center space-x-2"
              >
                <span>View all</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="p-6">
            {recentCourses.length > 0 ? (
              <div className="space-y-3">
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
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-text-muted mx-auto mb-4" />
                <p className="text-text-muted">No courses found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 