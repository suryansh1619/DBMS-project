const express = require('express');
const router=express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT p.performance_id, s.first_name AS student_first_name, s.last_name AS student_last_name, p.sgpa, p.remarks, p.semester
            FROM Performance p
            JOIN Students s ON p.student_id = s.student_id;`;
        const students = await db.promise().query(query);
        res.status(200).json(students[0]);
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/admin', async (req, res) => {
    try {
        const query = "SELECT * FROM Performance";
        const enrollments = await db.promise().query(query);
        res.status(200).json(enrollments[0]);
    } catch (error) {
        console.error("Error fetching enrollments:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;