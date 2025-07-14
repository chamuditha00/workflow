package com.example.university.course.management.system.repository;

import com.example.university.course.management.system.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    
    List<Enrollment> findByStudentId(Long studentId);
    
    List<Enrollment> findByCourseId(Long courseId);
    
    Optional<Enrollment> findByStudentIdAndCourseId(Long studentId, Long courseId);
    
    @Query("SELECT e FROM Enrollment e WHERE e.student.id = :studentId AND e.status = 'ENROLLED'")
    List<Enrollment> findActiveEnrollmentsByStudentId(@Param("studentId") Long studentId);
    
    @Query("SELECT e FROM Enrollment e WHERE e.course.id = :courseId AND e.status = 'ENROLLED'")
    List<Enrollment> findActiveEnrollmentsByCourseId(@Param("courseId") Long courseId);
    
    boolean existsByStudentIdAndCourseId(Long studentId, Long courseId);
} 