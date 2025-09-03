package com.example.university.course.management.system.controller;

import com.example.university.course.management.system.entity.User;
import com.example.university.course.management.system.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

        // Registration endpoint should only be used by lecturers to register other lecturers
        @PostMapping("/register")
        public ResponseEntity<?> registerLecturer(@RequestBody Map<String, String> body) {
            String email = body.get("email");
            String password = body.get("password");
            // Only allow lecturer registration here
            try {
                User user = userService.registerLecturer(email, password);
                return ResponseEntity.ok(user);
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
            }
        }

        @PostMapping("/login")
        public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
            String email = body.get("email");
            String password = body.get("password");
            
            // If only email is provided, check for first-time login
            if (password == null || password.trim().isEmpty()) {
                try {
                    var userOpt = userService.checkFirstTimeLogin(email);
                    if (userOpt.isPresent()) {
                        return ResponseEntity.ok(Map.of(
                            "firstTimeLogin", true,
                            "email", email,
                            "message", "First time login. Please set your password."
                        ));
                    } else {
                        return ResponseEntity.status(404).body("User not found or not eligible for first-time setup");
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                    return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
                }
            }
            
            // Regular login with email and password
            try {
                var userOpt = userService.login(email, password);
                if (userOpt.isPresent()) {
                    User user = userOpt.get();
                    // Check if it's a student's first login
                    if (user.getRole().equals("student") && user.isFirstLogin()) {
                        return ResponseEntity.ok(Map.of(
                            "firstTimeLogin", true,
                            "email", email,
                            "message", "First time login. Please set your password."
                        ));
                    }
                    return ResponseEntity.ok(user);
                } else {
                    return ResponseEntity.status(401).body("Invalid credentials");
                }
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
            }
        }

        @PostMapping("/setup-password")
        public ResponseEntity<?> setupPassword(@RequestBody Map<String, String> body) {
            String email = body.get("email");
            String newPassword = body.get("password");
            
            if (email == null || newPassword == null || newPassword.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Email and password are required");
            }
            
            try {
                User user = userService.setStudentPassword(email, newPassword);
                return ResponseEntity.ok(Map.of(
                    "message", "Password set successfully",
                    "user", user
                ));
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.badRequest().body("Password setup failed: " + e.getMessage());
            }
        }
}
