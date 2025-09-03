package com.example.university.course.management.system.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;

@RestController
public class DatabaseTestController {
    
    @Autowired
    private DataSource dataSource;
    
    @Value("${spring.datasource.url:Not Set}")
    private String datasourceUrl;
    
    @Value("${spring.datasource.username:Not Set}")
    private String datasourceUsername;
    
    @GetMapping("/api/database/test")
    public Map<String, Object> testDatabaseConnection() {
        Map<String, Object> result = new HashMap<>();
        
        try {
            Connection connection = dataSource.getConnection();
            String databaseName = connection.getCatalog();
            String databaseProductName = connection.getMetaData().getDatabaseProductName();
            String databaseProductVersion = connection.getMetaData().getDatabaseProductVersion();
            connection.close();
            
            result.put("status", "SUCCESS");
            result.put("message", "Database connection successful");
            result.put("databaseName", databaseName);
            result.put("databaseProduct", databaseProductName);
            result.put("databaseVersion", databaseProductVersion);
            result.put("datasourceUrl", maskPassword(datasourceUrl));
            result.put("username", datasourceUsername);
            
        } catch (Exception e) {
            result.put("status", "FAILED");
            result.put("message", "Database connection failed: " + e.getMessage());
            result.put("datasourceUrl", maskPassword(datasourceUrl));
            result.put("username", datasourceUsername);
            result.put("error", e.getClass().getSimpleName());
        }
        
        return result;
    }
    
    @GetMapping("/health")
    public Map<String, String> health() {
        Map<String, String> status = new HashMap<>();
        try {
            Connection connection = dataSource.getConnection();
            connection.close();
            status.put("status", "UP");
            status.put("database", "Connected");
        } catch (Exception e) {
            status.put("status", "DOWN");
            status.put("database", "Disconnected: " + e.getMessage());
        }
        return status;
    }
    
    private String maskPassword(String url) {
        if (url == null) return "Not Set";
        return url.replaceAll("password=[^&]*", "password=***");
    }
}
