import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

export const getStudent = (id) => api.get(`/students/${id}`);
export const getAllStudents = () => api.get('/students');
export const createStudent = (studentData) => api.post('/students', studentData);
export const updateStudent = (id, studentData) => api.put(`/students/${id}`, studentData);
export const deleteStudent = (id) => api.delete(`/students/${id}`);

export const getCourse = (id) => api.get(`/courses/${id}`);
export const getAllCourses = () => api.get('/courses');
export const createCourse = (courseData) => api.post('/courses', courseData);
export const updateCourse = (id, courseData) => api.put(`/courses/${id}`, courseData);
export const deleteCourse = (id) => api.delete(`/courses/${id}`);

export const enrollStudent = (studentId, courseId) =>
  api.post('/enrollments', { studentId, courseId });
export const updateGrade = (enrollmentId, grade) =>
  api.put(`/enrollments/${enrollmentId}/grade`, { grade });

export const login = (email, password) =>
  api.post('/users/login', { email, password });

export const setupPassword = (email, password) =>
  api.post('/users/setup-password', { email, password });

export const register = (email, password) =>
  api.post('/users/register', { email, password });

export default api;