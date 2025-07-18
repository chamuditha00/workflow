import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  BarChart3, 
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

const Layout = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: BarChart3 },
    { name: 'Students', href: '/students', icon: Users },
    { name: 'Courses', href: '/courses', icon: BookOpen },
    { name: 'Enrollments', href: '/enrollments', icon: GraduationCap },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-primary via-dark-secondary to-dark-tertiary">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col glass animate-slide-in-right">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-primary animate-glow" />
              <span className="ml-2 text-xl font-bold gradient-text">CourseFlow</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-text-muted hover:text-text-primary transition-colors p-2 rounded-lg hover:bg-dark-tertiary"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 space-y-2 px-4 py-4">
            {navigation.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 animate-fade-in-up hover-lift ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                      : 'text-text-secondary hover:bg-dark-tertiary hover:text-text-primary'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow glass border-r border-gray-600">
          <div className="flex items-center h-16 px-4">
            <GraduationCap className="h-8 w-8 text-primary animate-glow" />
            <span className="ml-2 text-xl font-bold gradient-text">CourseFlow</span>
          </div>
          <nav className="flex-1 space-y-2 px-4 py-4">
            {navigation.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 animate-fade-in-up hover-lift ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                      : 'text-text-secondary hover:bg-dark-tertiary hover:text-text-primary'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 glass-light border-b border-gray-600 px-4 shadow-lg sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-text-secondary hover:text-text-primary lg:hidden transition-colors rounded-lg hover:bg-dark-tertiary"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1 items-center justify-end">
              <div className="flex items-center space-x-4">
                <div className="hidden sm:block">
                  <span className="text-sm text-text-muted">Welcome back!</span>
                </div>
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center status-online">
                  <span className="text-white font-semibold text-sm">A</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout; 