package com.example.university.course.management.system.repository;

import com.example.university.course.management.system.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    
    Optional<Course> findByCourseCode(String courseCode);
    
    List<Course> findByInstructor(String instructor);
    
    List<Course> findByCourseNameContainingIgnoreCase(String courseName);
    
    @Query("SELECT c FROM Course c JOIN c.enrollments e WHERE e.student.id = :studentId")
    List<Course> findCoursesByStudentId(@Param("studentId") Long studentId);
    
    boolean existsByCourseCode(String courseCode);
} 