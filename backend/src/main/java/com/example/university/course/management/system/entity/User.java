package com.example.university.course.management.system.entity;

import jakarta.persistence.*;

@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String email;
    private String password;
    private String role; // "student" or "lecturer"
    private boolean firstLogin = true; // Track if this is the first login

    public User() {}
    public User(String email, String password, String role) {
        this.email = email;
        this.password = password;
        this.role = role;
        this.firstLogin = "student".equals(role); // Students need first-time setup
    }
    public Long getId() { return id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public boolean isFirstLogin() { return firstLogin; }
    public void setFirstLogin(boolean firstLogin) { this.firstLogin = firstLogin; }
}
