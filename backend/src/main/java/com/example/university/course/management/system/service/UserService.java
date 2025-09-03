package com.example.university.course.management.system.service;

import com.example.university.course.management.system.entity.User;
import com.example.university.course.management.system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    // Only lecturers can be registered via this method
    public User registerLecturer(String email, String password) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("User already exists");
        }
        User user = new User(email, password, "lecturer");
        return userRepository.save(user);
    }

    // Login detects role internally
    public Optional<User> login(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent() && userOpt.get().getPassword().equals(password)) {
            return userOpt;
        }
        return Optional.empty();
    }

    // Check if student needs first-time setup (only email provided)
    public Optional<User> checkFirstTimeLogin(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent() && userOpt.get().getRole().equals("student") && userOpt.get().isFirstLogin()) {
            return userOpt;
        }
        return Optional.empty();
    }

    // Set password for first-time student login
    public User setStudentPassword(String email, String newPassword) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent() && userOpt.get().getRole().equals("student") && userOpt.get().isFirstLogin()) {
            User user = userOpt.get();
            user.setPassword(newPassword);
            user.setFirstLogin(false);
            return userRepository.save(user);
        }
        throw new RuntimeException("Invalid user or not eligible for first-time setup");
    }
}
