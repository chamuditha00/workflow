package com.example.university.course.management.system;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.example.university.course.management.system")
public class UniversityCourseManagementSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(UniversityCourseManagementSystemApplication.class, args);
	}

}
