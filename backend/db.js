const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'assign_1'
});
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected...');

    const departmentsTable = `
    CREATE TABLE IF NOT EXISTS Departments (
        department_id INT PRIMARY KEY AUTO_INCREMENT,
        department_name VARCHAR(100) UNIQUE NOT NULL
    );`;

    const studentsTable = `
    CREATE TABLE IF NOT EXISTS Students (
        student_id VARCHAR(10) PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        dob DATE,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(15),
        address TEXT,
        gender VARCHAR(10),
        enrollment_year INT NOT NULL,
        department_id INT NOT NULL,
        password VARCHAR(255) NOT NULL,
        FOREIGN KEY (department_id) REFERENCES Departments(department_id) ON DELETE CASCADE
    );`;

    const hodTable = `
    CREATE TABLE IF NOT EXISTS HOD (
        hod_id INT PRIMARY KEY AUTO_INCREMENT,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(15),
        hire_date DATE,
        department_id INT UNIQUE NOT NULL,
        FOREIGN KEY (department_id) REFERENCES Departments(department_id) ON DELETE CASCADE
    );`;

    const instructorsTable = `
    CREATE TABLE IF NOT EXISTS Instructors (
        instructor_id VARCHAR(10) PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(15),
        hire_date DATE,
        department_id INT NOT NULL,
        password VARCHAR(255) NOT NULL,
        FOREIGN KEY (department_id) REFERENCES Departments(department_id) ON DELETE CASCADE
    );`;

    const coursesTable = `
    CREATE TABLE IF NOT EXISTS Courses (
        course_id INT PRIMARY KEY AUTO_INCREMENT,
        course_code VARCHAR(10) UNIQUE NOT NULL,
        course_name VARCHAR(100) UNIQUE NOT NULL,
        credits INT NOT NULL,
        instructor_id VARCHAR(10),
        department_id INT,
        FOREIGN KEY (instructor_id) REFERENCES Instructors(instructor_id) ON DELETE CASCADE, 
        FOREIGN KEY (department_id) REFERENCES Departments(department_id) ON DELETE CASCADE
    );`;

    const enrollmentsTable = `
    CREATE TABLE IF NOT EXISTS Enrollments (
        enrollment_id INT PRIMARY KEY AUTO_INCREMENT,
        student_id VARCHAR(10) NOT NULL,
        course_id INT NOT NULL,
        UNIQUE (student_id, course_id),
        FOREIGN KEY (student_id) REFERENCES Students(student_id) ON DELETE CASCADE,
        FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE CASCADE
    );`;

    const examsTable = `
    CREATE TABLE IF NOT EXISTS Exams (
        exam_id INT PRIMARY KEY AUTO_INCREMENT,
        exam_name VARCHAR(100) NOT NULL,
        course_id INT NOT NULL,
        exam_date DATE NOT NULL,
        exam_time TIME NOT NULL,
        max_marks INT NOT NULL,
        UNIQUE (course_id, exam_date, exam_time),
        FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE CASCADE
    );`;

    const marksTable = `
    CREATE TABLE IF NOT EXISTS Marks (
        mark_id INT PRIMARY KEY AUTO_INCREMENT,
        student_id VARCHAR(10) NOT NULL,
        exam_id INT NOT NULL,
        obtained_marks INT NOT NULL,
        UNIQUE (student_id, exam_id),
        FOREIGN KEY (student_id) REFERENCES Students(student_id) ON DELETE CASCADE,
        FOREIGN KEY (exam_id) REFERENCES Exams(exam_id) ON DELETE CASCADE
    );`;

    const performanceTable = `
    CREATE TABLE IF NOT EXISTS Performance (
        performance_id INT PRIMARY KEY AUTO_INCREMENT,
        student_id VARCHAR(10) NOT NULL,
        sgpa FLOAT NOT NULL,
        remarks VARCHAR(200),
        semester VARCHAR(10) NOT NULL,
        UNIQUE (student_id, semester),
        FOREIGN KEY (student_id) REFERENCES Students(student_id) ON DELETE CASCADE
    );`;

    const noticesTable = `
    CREATE TABLE IF NOT EXISTS Notices (
        notice_id INT PRIMARY KEY AUTO_INCREMENT,
        heading VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`;
    const imagesTable = `
    CREATE TABLE IF NOT EXISTS Images (
        id INT PRIMARY KEY AUTO_INCREMENT,
        content VARCHAR(255) NOT NULL,
        image_path VARCHAR(255) NOT NULL
    );`;
    const imageGalleryTable = `
        CREATE TABLE IF NOT EXISTS ImageGallery (
            image_id INT PRIMARY KEY AUTO_INCREMENT,
            image_name VARCHAR(255) NOT NULL,
            image_url VARCHAR(255) NOT NULL
        );
    `;

    db.query(imageGalleryTable, (err, result) => {
        if (err) throw err;
        console.log("ImageGallery table created or already exists.");
    });
    db.query(imagesTable, (err, result) => {
        if (err) throw err;
        console.log("Images table created or already exists.");
    });

    db.query(noticesTable, (err, result) => {
        if (err) throw err;
        console.log("Notices table created or already exists.");
    });


    db.query(departmentsTable, (err, result) => {
        if (err) throw err;
        console.log("Departments table created or already exists.");
    });
    db.query(studentsTable, (err, result) => {
        if (err) throw err;
        console.log("Students table created or already exists.");
    });
    db.query(hodTable, (err, result) => {
        if (err) throw err;
        console.log("HOD table created or already exists.");
    });
    db.query(instructorsTable, (err, result) => {
        if (err) throw err;
        console.log("Instructors table created or already exists.");
    });
    db.query(coursesTable, (err, result) => {
        if (err) throw err;
        console.log("Courses table created or already exists.");
    });
    db.query(enrollmentsTable, (err, result) => {
        if (err) throw err;
        console.log("Enrollments table created or already exists.");
    });
    db.query(examsTable, (err, result) => {
        if (err) throw err;
        console.log("Exams table created or already exists.");
    });
    db.query(marksTable, (err, result) => {
        if (err) throw err;
        console.log("Marks table created or already exists.");
    });
    db.query(performanceTable, (err, result) => {
        if (err) throw err;
        console.log("Performance table created or already exists.");
    });
});

module.exports = db;