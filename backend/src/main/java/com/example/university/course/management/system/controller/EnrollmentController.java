package com.example.university.course.management.system.controller;

import com.example.university.course.management.system.dto.EnrollmentDTO;
import com.example.university.course.management.system.service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/enrollments")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class EnrollmentController {
    @Autowired
    private EnrollmentService enrollmentService;

    // Enroll student to course (no grade)
    @PostMapping
    public ResponseEntity<EnrollmentDTO> enrollStudent(@RequestBody EnrollmentDTO dto) {
        try {
            EnrollmentDTO enrollment = enrollmentService.enrollStudentToCourse(dto.getStudentId(), dto.getCourseId());
            return new ResponseEntity<>(enrollment, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    // Update grade for enrollment
    @PutMapping("/{id}/grade")
    public ResponseEntity<EnrollmentDTO> updateGrade(@PathVariable Long id, @RequestBody GradeRequest gradeRequest) {
        try {
            EnrollmentDTO enrollment = enrollmentService.updateGrade(id, gradeRequest.getGrade());
            return new ResponseEntity<>(enrollment, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    public static class GradeRequest {
        private Double grade;
        public Double getGrade() { return grade; }
        public void setGrade(Double grade) { this.grade = grade; }
    }
} 