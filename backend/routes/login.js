const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/login', async (req, res) => {
    const { userType, userId, password } = req.body;

    try {
        if (userType === 'student') {
            const [student] = await db.promise().query(
                `SELECT * FROM Students WHERE student_id = ? AND student_id = ?`,
                [userId, password]
            );
            if (student.length > 0) {
                return res.status(200).json({ success: true, userType: 'student', userId });
            }
        } else if (userType === 'instructor') {
            const [instructor] = await db.promise().query(
                `SELECT * FROM Instructors WHERE instructor_id = ? AND instructor_id = ?`,
                [userId, password]
            );
            if (instructor.length > 0) {
                return res.status(200).json({ success: true, userType: 'instructor', userId });
            }
        }
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
