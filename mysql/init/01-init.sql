-- Initialize the university database
USE university_db;

-- Create tables if they don't exist (JPA will handle this, but we can add custom initialization here)
-- The tables will be created automatically by JPA with hibernate.ddl-auto=update

-- You can add any custom initialization data here if needed
-- For example, inserting default courses, students, etc.

-- Example: Insert some sample data (optional)
-- INSERT INTO course (id, name, description, credits) VALUES (1, 'Introduction to Computer Science', 'Basic concepts of programming', 3);
-- INSERT INTO course (id, name, description, credits) VALUES (2, 'Data Structures', 'Advanced programming concepts', 4);
-- INSERT INTO course (id, name, description, credits) VALUES (3, 'Database Systems', 'SQL and database design', 3);

-- Note: The actual table creation and data insertion will be handled by Spring Boot JPA
-- This file is mainly for any custom MySQL-specific initialization if needed 