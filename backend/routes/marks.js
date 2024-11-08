const express = require('express');
const router=express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT m.mark_id, s.first_name AS student_first_name, s.last_name AS student_last_name, ex.exam_name,c.course_name, m.obtained_marks
            FROM Marks m
            JOIN Students s ON m.student_id = s.student_id
            JOIN Exams ex ON m.exam_id = ex.exam_id
            JOIN Courses c ON ex.course_id = c.course_id;`;
        const students = await db.promise().query(query);
        res.status(200).json(students[0]);
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/admin', async (req, res) => {
    try {
        const query = "SELECT * FROM Marks";
        const enrollments = await db.promise().query(query);
        res.status(200).json(enrollments[0]);
    } catch (error) {
        console.error("Error fetching enrollments:", error);
        res.status(500).json({ error: 'Server error' });
    }
});


router.post('/admin/add', async (req, res) => {
    const { student_id, exam_id, obtained_marks } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO Marks (student_id, exam_id, obtained_marks) VALUES (?, ?, ?)',
            [student_id, exam_id, obtained_marks]
        );
        res.status(201).json({ mark_id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create mark' });
    }
});


router.delete('/admin/:mark_id', async (req, res) => {
    const { mark_id } = req.params;
    try {
        await db.query('DELETE FROM Marks WHERE mark_id = ?', [mark_id]);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete mark' });
    }
});

module.exports = router;