package com.example.university.course.management.system.dto;

import java.util.List;

public class CourseDTO {
    
    private Long id;
    private String courseCode;
    private String courseName;
    private String description;
    private Integer credits;
    private String instructor;
    private Integer maxStudents;
    private List<EnrollmentDTO> enrollments;
    private String status = "ACTIVE";
    
    // Constructors
    public CourseDTO() {}
    
    public CourseDTO(Long id, String courseCode, String courseName, String description, Integer credits, String instructor, Integer maxStudents, String status) {
        this.id = id;
        this.courseCode = courseCode;
        this.courseName = courseName;
        this.description = description;
        this.credits = credits;
        this.instructor = instructor;
        this.maxStudents = maxStudents;
        this.status = status;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getCourseCode() {
        return courseCode;
    }
    
    public void setCourseCode(String courseCode) {
        this.courseCode = courseCode;
    }
    
    public String getCourseName() {
        return courseName;
    }
    
    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public Integer getCredits() {
        return credits;
    }
    
    public void setCredits(Integer credits) {
        this.credits = credits;
    }
    
    public String getInstructor() {
        return instructor;
    }
    
    public void setInstructor(String instructor) {
        this.instructor = instructor;
    }
    
    public Integer getMaxStudents() {
        return maxStudents;
    }
    
    public void setMaxStudents(Integer maxStudents) {
        this.maxStudents = maxStudents;
    }
    
    public List<EnrollmentDTO> getEnrollments() {
        return enrollments;
    }
    
    public void setEnrollments(List<EnrollmentDTO> enrollments) {
        this.enrollments = enrollments;
    }
    
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    
    @Override
    public String toString() {
        return "CourseDTO{" +
                "id=" + id +
                ", courseCode='" + courseCode + '\'' +
                ", courseName='" + courseName + '\'' +
                ", description='" + description + '\'' +
                ", credits=" + credits +
                ", instructor='" + instructor + '\'' +
                ", maxStudents=" + maxStudents +
                ", status='" + status + '\'' +
                '}';
    }
} 