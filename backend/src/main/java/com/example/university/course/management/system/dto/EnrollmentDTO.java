package com.example.university.course.management.system.dto;

import java.time.LocalDateTime;

public class EnrollmentDTO {
    
    private Long id;
    private Long studentId;
    private String studentName;
    private Long courseId;
    private String courseName;
    private String courseCode;
    private LocalDateTime enrollmentDate;
    private String status;
    private Double grade;
    private String gradeLetter;
    private String comments;
    
    // Constructors
    public EnrollmentDTO() {}
    
    public EnrollmentDTO(Long id, Long studentId, String studentName, Long courseId, String courseName, String courseCode, 
                        LocalDateTime enrollmentDate, String status, Double grade, String gradeLetter, String comments) {
        this.id = id;
        this.studentId = studentId;
        this.studentName = studentName;
        this.courseId = courseId;
        this.courseName = courseName;
        this.courseCode = courseCode;
        this.enrollmentDate = enrollmentDate;
        this.status = status;
        this.grade = grade;
        this.gradeLetter = gradeLetter;
        this.comments = comments;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getStudentId() {
        return studentId;
    }
    
    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }
    
    public String getStudentName() {
        return studentName;
    }
    
    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }
    
    public Long getCourseId() {
        return courseId;
    }
    
    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }
    
    public String getCourseName() {
        return courseName;
    }
    
    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }
    
    public String getCourseCode() {
        return courseCode;
    }
    
    public void setCourseCode(String courseCode) {
        this.courseCode = courseCode;
    }
    
    public LocalDateTime getEnrollmentDate() {
        return enrollmentDate;
    }
    
    public void setEnrollmentDate(LocalDateTime enrollmentDate) {
        this.enrollmentDate = enrollmentDate;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
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
    
    @Override
    public String toString() {
        return "EnrollmentDTO{" +
                "id=" + id +
                ", studentId=" + studentId +
                ", studentName='" + studentName + '\'' +
                ", courseId=" + courseId +
                ", courseName='" + courseName + '\'' +
                ", courseCode='" + courseCode + '\'' +
                ", enrollmentDate=" + enrollmentDate +
                ", status='" + status + '\'' +
                ", grade=" + grade +
                ", gradeLetter='" + gradeLetter + '\'' +
                ", comments='" + comments + '\'' +
                '}';
    }
} 