const express = require('express');
const router=express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT ex.exam_id, ex.exam_name, ex.exam_date, ex.exam_time, ex.max_marks, c.course_name, c.course_code
            FROM Exams ex
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
        const [rows] = await db.query('SELECT * FROM Exams');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch exams' });
    }
});

router.post('/admin/add', async (req, res) => {
    const { exam_name, course_id, exam_date, exam_time, max_marks } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO Exams (exam_name, course_id, exam_date, exam_time, max_marks) VALUES (?, ?, ?, ?, ?)',
            [exam_name, course_id, exam_date, exam_time, max_marks]
        );
        res.status(201).json({ exam_id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create exam' });
    }
});

router.delete('/admin/:exam_id', async (req, res) => {
    const { exam_id } = req.params;
    try {
        await db.query('DELETE FROM Exams WHERE exam_id = ?', [exam_id]);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete exam' });
    }
});

module.exports = router;