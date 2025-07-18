import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Mail,
  Phone,
  Calendar,
  Users,
  GraduationCap
} from 'lucide-react';
import { getAllStudents, getStudent } from '../../services/api';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ show: false, student: null });
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    const filtered = students.filter(student =>
      student.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await getAllStudents();
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (studentId) => {
    try {
      await getStudent(studentId).then(response => {
        if (response.data) {
          const studentToDelete = response.data;
        }
      });
      fetchStudents();
      setDeleteModal({ show: false, student: null });
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const confirmDelete = (student) => {
    setDeleteModal({ show: true, student });
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between animate-fade-in-up">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Students</h1>
          <p className="text-text-secondary text-lg">Manage student information and enrollments</p>
        </div>
        <Link
          to="/students/new"
          className="btn btn-primary mt-6 sm:mt-0"
        >
          <Plus className="h-5 w-5" />
          Add Student
        </Link>
      </div>

      {/* Search */}
      <div className="relative animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted h-5 w-5" />
        <input
          type="text"
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input pl-12"
        />
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        {filteredStudents.map((student, index) => (
          <div key={student.id} className="card hover-lift" style={{ animationDelay: `${0.3 + index * 0.1}s` }}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-lg">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-text-primary">
                        {student.firstName} {student.lastName}
                      </h3>
                      <p className="text-sm text-text-muted">ID: {student.studentId}</p>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate(`/students/${student.id}`)}
                    className="btn btn-secondary btn-sm"
                    title="View Profile"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <Link
                    to={`/students/${student.id}/edit`}
                    className="btn btn-accent btn-sm"
                    title="Edit Student"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => confirmDelete(student)}
                    className="btn btn-danger btn-sm"
                    title="Delete Student"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center text-text-secondary">
                  <Mail className="h-4 w-4 mr-3 text-gray-400" />
                  <span className="truncate">{student.email}</span>
                </div>
                {student.phoneNumber && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-3 text-gray-400" />
                    <span>{student.phoneNumber}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Enrollments:</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded-full">
                    {student.enrollments?.length || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-16 animate-fade-in-up">
          <div className="text-text-muted mb-6">
            <Users className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-2xl font-bold text-text-primary mb-3">
            {searchTerm ? 'No students found' : 'No students yet'}
          </h3>
          <p className="text-text-secondary mb-6 text-lg">
            {searchTerm 
              ? 'Try adjusting your search terms'
              : 'Get started by adding your first student'
            }
          </p>
          {!searchTerm && (
            <Link to="/students/new" className="btn btn-primary">
              <Plus className="h-5 w-5" />
              Add Student
            </Link>
          )}
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="card max-w-md w-full mx-4 animate-fade-in-up">
            <div className="p-6">
              <h3 className="text-xl font-bold text-text-primary mb-4">
                Delete Student
              </h3>
              <p className="text-text-secondary mb-6">
                Are you sure you want to delete {deleteModal.student?.firstName} {deleteModal.student?.lastName}? 
                This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setDeleteModal({ show: false, student: null })}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteModal.student.id)}
                  className="btn btn-danger flex-1"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList; 