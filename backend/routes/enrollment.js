const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT e.enrollment_id, s.first_name AS student_first_name, s.last_name AS student_last_name, c.course_name, c.course_code
            FROM Enrollments e
            JOIN Students s ON e.student_id = s.student_id
            JOIN Courses c ON e.course_id = c.course_id;`;
        const enrollments = await db.promise().query(query);
        res.status(200).json(enrollments[0]);
    } catch (error) {
        console.error("Error fetching enrollments:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/admin', async (req, res) => {
    try {
        const query = "SELECT * FROM Enrollments";
        const enrollments = await db.promise().query(query);
        res.status(200).json(enrollments[0]);
    } catch (error) {
        console.error("Error fetching enrollments:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/admin/add', async (req, res) => {
    const { student_id, course_id } = req.body;
    try {
        const query = "INSERT INTO Enrollments (student_id, course_id) VALUES (?, ?)";
        const [result] = await db.promise().query(query, [student_id, course_id]);
        res.status(201).json({ id: result.insertId, student_id, course_id });
    } catch (error) {
        console.error("Error adding enrollment:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/admin/:id', async (req, res) => {
    const enrollmentId = req.params.id;
    const { student_id, course_id } = req.body;
    
    try {
        const query = "UPDATE Enrollments SET student_id = ?, course_id = ? WHERE enrollment_id = ?";
        const [result] = await db.promise().query(query, [student_id, course_id, enrollmentId]);
        
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Enrollment updated successfully' });
        } else {
            res.status(404).json({ error: 'Enrollment not found' });
        }
    } catch (error) {
        console.error("Error updating enrollment:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.delete('/admin/:id', async (req, res) => {
    const enrollmentId = req.params.id;
    try {
        const query = "DELETE FROM Enrollments WHERE enrollment_id = ?";
        const [result] = await db.promise().query(query, [enrollmentId]);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Enrollment deleted' });
        } else {
            res.status(404).json({ error: 'Enrollment not found' });
        }
    } catch (error) {
        console.error("Error deleting enrollment:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
