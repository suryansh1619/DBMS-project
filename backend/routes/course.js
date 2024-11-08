const express = require('express');
const router=express.Router();
const db = require('../db'); 

router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT c.course_id, c.course_code, c.course_name, c.credits, d.department_name, CONCAT(i.first_name, ' ', i.last_name) AS instructor_name,
            i.instructor_id
            FROM Courses c
            JOIN Departments d ON c.department_id = d.department_id
            LEFT JOIN Instructors i ON c.instructor_id = i.instructor_id;`;
        const courses = await db.promise().query(query);
        res.status(200).json(courses[0]);
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/faculty', async (req, res) => {
    const facultyId = req.query.faculty_id; // Get the faculty ID from query parameters

    try {
        let query = `
            SELECT c.course_id, c.course_code, c.course_name, c.credits, d.department_name, 
            CONCAT(i.first_name, ' ', i.last_name) AS instructor_name
            FROM Courses c
            JOIN Departments d ON c.department_id = d.department_id
            LEFT JOIN Instructors i ON c.instructor_id = i.instructor_id
        `;

        // Filter by faculty ID if provided
        if (facultyId) {
            query += ` WHERE i.instructor_id = ?`;
        }

        // Execute the query
        const courses = facultyId 
            ? await db.promise().query(query, [facultyId]) 
            : await db.promise().query(query);

        res.status(200).json(courses[0]);
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ error: 'Server error' });
    }
});


router.get('/admin', async (req, res) => {
    try {
        const query = `
            SELECT * FROM Courses`;
        const courses = await db.promise().query(query);
        res.status(200).json(courses[0]);
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/admin/add', async (req, res) => {
    const { course_name, course_code, credits, department_id, instructor_id } = req.body; 
    try {
        const query = "INSERT INTO Courses (course_name, course_code, credits, department_id, instructor_id) VALUES (?, ?, ?, ?, ?)";
        const [result] = await db.promise().query(query, [course_name, course_code, credits, department_id, instructor_id]);
        res.status(201).json({ id: result.insertId, course_name, course_code, credits, department_id, instructor_id });
    } catch (error) {
        console.error("Error adding course:", error);
        res.status(500).json({ error: 'Server error' });
    }
});


router.put('/admin/:id', async (req, res) => {
    const courseId = req.params.id;
    const { course_name, department_id, instructor_id, course_code, credits } = req.body; 
    try {
        const query = 'UPDATE Courses SET course_name = ?, department_id = ?, instructor_id = ?, course_code = ?, credits = ? WHERE course_id = ?';
        const [result] = await db.promise().query(query, [course_name, department_id, instructor_id, course_code, credits, courseId]); 
        
        if (result.affectedRows > 0) {
            res.status(200).json({ id: courseId, course_name, department_id, instructor_id, course_code, credits }); 
        } else {
            res.status(404).json({ error: 'Course not found' });
        }
    } catch (error) {
        console.error("Error updating course:", error);
        res.status(500).json({ error: 'Server error' });
    }
});


router.delete('/admin/:id', async (req, res) => {
    const courseId = req.params.id;
    try {
        const query = "DELETE FROM Courses WHERE course_id = ?";
        const [result] = await db.promise().query(query, [courseId]);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Course deleted' });
        } else {
            res.status(404).json({ error: 'Course not found' });
        }
    } catch (error) {
        console.error("Error deleting course:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;