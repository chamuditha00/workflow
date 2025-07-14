package com.example.university.course.management.system.repository;

import com.example.university.course.management.system.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    
    Optional<Student> findByEmail(String email);
    
    Optional<Student> findByStudentId(String studentId);
    
    List<Student> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String firstName, String lastName);
    
    @Query("SELECT s FROM Student s JOIN s.enrollments e WHERE e.course.id = :courseId")
    List<Student> findStudentsByCourseId(@Param("courseId") Long courseId);
    
    boolean existsByEmail(String email);
    
    boolean existsByStudentId(String studentId);
} 