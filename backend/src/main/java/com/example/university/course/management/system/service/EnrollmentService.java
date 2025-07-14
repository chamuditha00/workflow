package com.example.university.course.management.system.service;

import com.example.university.course.management.system.dto.EnrollmentDTO;
import com.example.university.course.management.system.entity.Course;
import com.example.university.course.management.system.entity.Enrollment;
import com.example.university.course.management.system.entity.Student;
import com.example.university.course.management.system.repository.CourseRepository;
import com.example.university.course.management.system.repository.EnrollmentRepository;
import com.example.university.course.management.system.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class EnrollmentService {
    @Autowired
    private EnrollmentRepository enrollmentRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private CourseRepository courseRepository;

    public EnrollmentDTO enrollStudentToCourse(Long studentId, Long courseId) {
        Optional<Student> student = studentRepository.findById(studentId);
        Optional<Course> course = courseRepository.findById(courseId);
        if (student.isEmpty() || course.isEmpty()) {
            throw new RuntimeException("Student or Course not found");
        }
        if (enrollmentRepository.existsByStudentIdAndCourseId(studentId, courseId)) {
            throw new RuntimeException("Already enrolled");
        }
        Enrollment enrollment = new Enrollment(student.get(), course.get());
        Enrollment saved = enrollmentRepository.save(enrollment);
        return toDTO(saved);
    }

    public EnrollmentDTO updateGrade(Long enrollmentId, Double grade) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));
        enrollment.setGrade(grade);
        Enrollment saved = enrollmentRepository.save(enrollment);
        return toDTO(saved);
    }

    private EnrollmentDTO toDTO(Enrollment enrollment) {
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