package com.example.university.course.management.system.service;

import com.example.university.course.management.system.dto.EnrollmentDTO;
import com.example.university.course.management.system.dto.StudentDTO;
import com.example.university.course.management.system.entity.Course;
import com.example.university.course.management.system.entity.Enrollment;
import com.example.university.course.management.system.entity.Student;
import com.example.university.course.management.system.repository.CourseRepository;
import com.example.university.course.management.system.repository.EnrollmentRepository;
import com.example.university.course.management.system.repository.StudentRepository;
import com.example.university.course.management.system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StudentService {
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private CourseRepository courseRepository;
    
    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private UserRepository userRepository;
    
    // Create a new student
    public StudentDTO createStudent(StudentDTO studentDTO) {
        if (studentRepository.existsByEmail(studentDTO.getEmail())) {
            throw new RuntimeException("Student with email " + studentDTO.getEmail() + " already exists");
        }
        if (studentRepository.existsByStudentId(studentDTO.getStudentId())) {
            throw new RuntimeException("Student with ID " + studentDTO.getStudentId() + " already exists");
        }
        Student student = new Student(
            studentDTO.getFirstName(),
            studentDTO.getLastName(),
            studentDTO.getEmail(),
            studentDTO.getPhoneNumber(),
            studentDTO.getStudentId()
        );
        Student savedStudent = studentRepository.save(student);
        // Also create a User entity for login
        if (!userRepository.findByEmail(studentDTO.getEmail()).isPresent()) {
            com.example.university.course.management.system.entity.User user =
                new com.example.university.course.management.system.entity.User(
                    studentDTO.getEmail(),
                    studentDTO.getStudentId(), // Use studentId as temporary password
                    "student"
                );
            // User will be marked as firstLogin=true by default for students
            userRepository.save(user);
        }
        return convertToDTO(savedStudent);
    }
    
    // Get all students
    public List<StudentDTO> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Get student by ID
    public StudentDTO getStudentById(Long id) {
        Optional<Student> student = studentRepository.findById(id);
        if (student.isPresent()) {
            return convertToDTO(student.get());
        }
        throw new RuntimeException("Student not found with id: " + id);
    }
    
    // Update student
    public StudentDTO updateStudent(Long id, StudentDTO studentDTO) {
        Optional<Student> existingStudent = studentRepository.findById(id);
        if (existingStudent.isPresent()) {
            Student student = existingStudent.get();
            
            // Check if email is being changed and if it already exists
            if (!student.getEmail().equals(studentDTO.getEmail()) && 
                studentRepository.existsByEmail(studentDTO.getEmail())) {
                throw new RuntimeException("Student with email " + studentDTO.getEmail() + " already exists");
            }
            
            // Check if student ID is being changed and if it already exists
            if (!student.getStudentId().equals(studentDTO.getStudentId()) && 
                studentRepository.existsByStudentId(studentDTO.getStudentId())) {
                throw new RuntimeException("Student with ID " + studentDTO.getStudentId() + " already exists");
            }
            
            student.setFirstName(studentDTO.getFirstName());
            student.setLastName(studentDTO.getLastName());
            student.setEmail(studentDTO.getEmail());
            student.setPhoneNumber(studentDTO.getPhoneNumber());
            student.setStudentId(studentDTO.getStudentId());
            
            Student updatedStudent = studentRepository.save(student);
            return convertToDTO(updatedStudent);
        }
        throw new RuntimeException("Student not found with id: " + id);
    }
    
    // Delete student
    public void deleteStudent(Long id) {
        if (studentRepository.existsById(id)) {
            studentRepository.deleteById(id);
        } else {
            throw new RuntimeException("Student not found with id: " + id);
        }
    }
    
    // Get student enrollments
    public List<EnrollmentDTO> getStudentEnrollments(Long studentId) {
        if (!studentRepository.existsById(studentId)) {
            throw new RuntimeException("Student not found with id: " + studentId);
        }
        
        return enrollmentRepository.findByStudentId(studentId).stream()
                .map(this::convertEnrollmentToDTO)
                .collect(Collectors.toList());
    }
    
    // Enroll student in a course
    public EnrollmentDTO enrollStudentInCourse(Long studentId, Long courseId) {
        Optional<Student> student = studentRepository.findById(studentId);
        Optional<Course> course = courseRepository.findById(courseId);
        
        if (student.isEmpty()) {
            throw new RuntimeException("Student not found with id: " + studentId);
        }
        
        if (course.isEmpty()) {
            throw new RuntimeException("Course not found with id: " + courseId);
        }
        
        // Check if already enrolled
        if (enrollmentRepository.existsByStudentIdAndCourseId(studentId, courseId)) {
            throw new RuntimeException("Student is already enrolled in this course");
        }
        
        // Check if course is full
        long enrolledCount = enrollmentRepository.findActiveEnrollmentsByCourseId(courseId).size();
        if (enrolledCount >= course.get().getMaxStudents()) {
            throw new RuntimeException("Course is full. Cannot enroll more students");
        }
        
        Enrollment enrollment = new Enrollment(student.get(), course.get());
        Enrollment savedEnrollment = enrollmentRepository.save(enrollment);
        return convertEnrollmentToDTO(savedEnrollment);
    }
    
    // Convert Student entity to DTO
    private StudentDTO convertToDTO(Student student) {
        StudentDTO dto = new StudentDTO(
            student.getId(),
            student.getFirstName(),
            student.getLastName(),
            student.getEmail(),
            student.getPhoneNumber(),
            student.getStudentId()
        );
        
        // Convert enrollments if needed
        List<EnrollmentDTO> enrollmentDTOs = student.getEnrollments().stream()
                .map(this::convertEnrollmentToDTO)
                .collect(Collectors.toList());
        dto.setEnrollments(enrollmentDTOs);
        
        return dto;
    }
    
    // Convert Enrollment entity to DTO
    private EnrollmentDTO convertEnrollmentToDTO(Enrollment enrollment) {
        return new EnrollmentDTO(
            enrollment.getId(),
            enrollment.getStudent().getId(),
            enrollment.getStudent().getFirstName() + " " + enrollment.getStudent().getLastName(),
            enrollment.getCourse().getId(),
            enrollment.getCourse().getCourseName(),
            enrollment.getCourse().getCourseCode(),
            enrollment.getEnrollmentDate(),
            enrollment.getStatus(),
            enrollment.getGrade(),
            enrollment.getGradeLetter(),
            enrollment.getComments()
        );
    }
}