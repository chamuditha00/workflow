package com.example.university.course.management.system.controller;

import com.example.university.course.management.system.dto.CourseDTO;
import com.example.university.course.management.system.dto.EnrollmentDTO;
import com.example.university.course.management.system.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class CourseController {
    
    @Autowired
    private CourseService courseService;
    
    // Create a new course
    @PostMapping
    public ResponseEntity<CourseDTO> createCourse(@RequestBody CourseDTO courseDTO) {
        try {
            CourseDTO createdCourse = courseService.createCourse(courseDTO);
            return new ResponseEntity<>(createdCourse, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    // Get all courses
    @GetMapping
    public ResponseEntity<List<CourseDTO>> getAllCourses() {
        List<CourseDTO> courses = courseService.getAllCourses();
        return new ResponseEntity<>(courses, HttpStatus.OK);
    }
    
    // Get course by ID
    @GetMapping("/{id}")
    public ResponseEntity<CourseDTO> getCourseById(@PathVariable Long id) {
        try {
            CourseDTO course = courseService.getCourseById(id);
            return new ResponseEntity<>(course, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    // Update course
    @PutMapping("/{id}")
    public ResponseEntity<CourseDTO> updateCourse(@PathVariable Long id, @RequestBody CourseDTO courseDTO) {
        try {
            CourseDTO updatedCourse = courseService.updateCourse(id, courseDTO);
            return new ResponseEntity<>(updatedCourse, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    // Delete course
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        try {
            courseService.deleteCourse(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    // Get course enrollments (students enrolled in the course)
    @GetMapping("/{id}/enrollments")
    public ResponseEntity<List<EnrollmentDTO>> getCourseEnrollments(@PathVariable Long id) {
        try {
            List<EnrollmentDTO> enrollments = courseService.getCourseEnrollments(id);
            return new ResponseEntity<>(enrollments, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    // Add result to a student in a course
    @PostMapping("/{courseId}/students/{studentId}/result")
    public ResponseEntity<EnrollmentDTO> addResult(
            @PathVariable Long courseId,
            @PathVariable Long studentId,
            @RequestBody ResultRequest resultRequest) {
        try {
            EnrollmentDTO enrollment = courseService.addResult(
                courseId, 
                studentId, 
                resultRequest.getGrade(), 
                resultRequest.getGradeLetter(), 
                resultRequest.getComments()
            );
            return new ResponseEntity<>(enrollment, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    // Inner class for result request
    public static class ResultRequest {
        private Double grade;
        private String gradeLetter;
        private String comments;
        
        // Getters and Setters
        public Double getGrade() {
            return grade;
        }
        
        public void setGrade(Double grade) {
            this.grade = grade;
        }
        
        public String getGradeLetter() {
            return gradeLetter;
        }
        
        public void setGradeLetter(String gradeLetter) {
            this.gradeLetter = gradeLetter;
        }
        
        public String getComments() {
            return comments;
        }
        
        public void setComments(String comments) {
            this.comments = comments;
        }
    }
} 