package com.example.university.course.management.system.service;

import com.example.university.course.management.system.dto.CourseDTO;
import com.example.university.course.management.system.dto.EnrollmentDTO;
import com.example.university.course.management.system.entity.Course;
import com.example.university.course.management.system.entity.Enrollment;
import com.example.university.course.management.system.repository.CourseRepository;
import com.example.university.course.management.system.repository.EnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CourseService {
    
    @Autowired
    private CourseRepository courseRepository;
    
    @Autowired
    private EnrollmentRepository enrollmentRepository;
    
    // Create a new course
    public CourseDTO createCourse(CourseDTO courseDTO) {
        if (courseRepository.existsByCourseCode(courseDTO.getCourseCode())) {
            throw new RuntimeException("Course with code " + courseDTO.getCourseCode() + " already exists");
        }
        
        Course course = new Course(
            courseDTO.getCourseCode(),
            courseDTO.getCourseName(),
            courseDTO.getDescription(),
            courseDTO.getCredits(),
            courseDTO.getInstructor(),
            courseDTO.getMaxStudents(),
            courseDTO.getStatus() != null ? courseDTO.getStatus() : "ACTIVE"
        );
        
        Course savedCourse = courseRepository.save(course);
        return convertToDTO(savedCourse);
    }
    
    // Get all courses
    public List<CourseDTO> getAllCourses() {
        return courseRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Get course by ID
    public CourseDTO getCourseById(Long id) {
        Optional<Course> course = courseRepository.findById(id);
        if (course.isPresent()) {
            return convertToDTO(course.get());
        }
        throw new RuntimeException("Course not found with id: " + id);
    }
    
    // Update course
    public CourseDTO updateCourse(Long id, CourseDTO courseDTO) {
        Optional<Course> existingCourse = courseRepository.findById(id);
        if (existingCourse.isPresent()) {
            Course course = existingCourse.get();
            
            // Check if course code is being changed and if it already exists
            if (!course.getCourseCode().equals(courseDTO.getCourseCode()) && 
                courseRepository.existsByCourseCode(courseDTO.getCourseCode())) {
                throw new RuntimeException("Course with code " + courseDTO.getCourseCode() + " already exists");
            }
            
            course.setCourseCode(courseDTO.getCourseCode());
            course.setCourseName(courseDTO.getCourseName());
            course.setDescription(courseDTO.getDescription());
            course.setCredits(courseDTO.getCredits());
            course.setInstructor(courseDTO.getInstructor());
            course.setMaxStudents(courseDTO.getMaxStudents());
            course.setStatus(courseDTO.getStatus() != null ? courseDTO.getStatus() : course.getStatus());
            
            Course updatedCourse = courseRepository.save(course);
            return convertToDTO(updatedCourse);
        }
        throw new RuntimeException("Course not found with id: " + id);
    }
    
    // Delete course
    public void deleteCourse(Long id) {
        if (courseRepository.existsById(id)) {
            // Check if there are any enrollments for this course
            List<Enrollment> enrollments = enrollmentRepository.findByCourseId(id);
            if (!enrollments.isEmpty()) {
                throw new RuntimeException("Cannot delete course. There are students enrolled in this course.");
            }
            courseRepository.deleteById(id);
        } else {
            throw new RuntimeException("Course not found with id: " + id);
        }
    }
    
    // Get course enrollments (students enrolled in the course)
    public List<EnrollmentDTO> getCourseEnrollments(Long courseId) {
        if (!courseRepository.existsById(courseId)) {
            throw new RuntimeException("Course not found with id: " + courseId);
        }
        
        return enrollmentRepository.findByCourseId(courseId).stream()
                .map(this::convertEnrollmentToDTO)
                .collect(Collectors.toList());
    }
    
    // Add result to a student in a course
    public EnrollmentDTO addResult(Long courseId, Long studentId, Double grade, String gradeLetter, String comments) {
        Optional<Enrollment> enrollment = enrollmentRepository.findByStudentIdAndCourseId(studentId, courseId);
        
        if (enrollment.isEmpty()) {
            throw new RuntimeException("Student is not enrolled in this course");
        }
        
        Enrollment enrollmentEntity = enrollment.get();
        enrollmentEntity.setGrade(grade);
        enrollmentEntity.setGradeLetter(gradeLetter);
        enrollmentEntity.setComments(comments);
        enrollmentEntity.setStatus("COMPLETED");
        
        Enrollment savedEnrollment = enrollmentRepository.save(enrollmentEntity);
        return convertEnrollmentToDTO(savedEnrollment);
    }
    
    // Convert Course entity to DTO
    private CourseDTO convertToDTO(Course course) {
        CourseDTO dto = new CourseDTO(
            course.getId(),
            course.getCourseCode(),
            course.getCourseName(),
            course.getDescription(),
            course.getCredits(),
            course.getInstructor(),
            course.getMaxStudents(),
            course.getStatus()
        );
        
        // Convert enrollments if needed
        List<EnrollmentDTO> enrollmentDTOs = course.getEnrollments().stream()
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