package com.example.university.course.management.system.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "enrollments")
public class Enrollment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;
    
    @Column(nullable = false)
    private LocalDateTime enrollmentDate;
    
    @Column(nullable = false)
    private String status; // ENROLLED, DROPPED, COMPLETED
    
    private Double grade;
    
    private String gradeLetter; // A, B, C, D, F
    
    private String comments;
    
    // Constructors
    public Enrollment() {
        this.enrollmentDate = LocalDateTime.now();
        this.status = "ENROLLED";
    }
    
    public Enrollment(Student student, Course course) {
        this();
        this.student = student;
        this.course = course;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Student getStudent() {
        return student;
    }
    
    public void setStudent(Student student) {
        this.student = student;
    }
    
    public Course getCourse() {
        return course;
    }
    
    public void setCourse(Course course) {
        this.course = course;
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
        return "Enrollment{" +
                "id=" + id +
                ", student=" + (student != null ? student.getId() : null) +
                ", course=" + (course != null ? course.getId() : null) +
                ", enrollmentDate=" + enrollmentDate +
                ", status='" + status + '\'' +
                ", grade=" + grade +
                ", gradeLetter='" + gradeLetter + '\'' +
                ", comments='" + comments + '\'' +
                '}';
    }
} 