const express = require('express');
const router=express.Router();
const db = require('../db');

router.post('/login', async (req, res) => {
    const { studentId, password } = req.body; // Accepting studentId and password
    console.log(studentId)

    if (!studentId || !password) {
        return res.status(400).json({ error: 'Student ID and password are required' });
    }

    try {
        // Query to find the student by student_id
        const query = `
            SELECT student_id, first_name, last_name, email, password 
            FROM Students 
            WHERE student_id = ?;
        `;
        const result = await db.promise().query(query, [studentId]);

        console.log(result[0]); // Log the result to check the output

        if (result[0].length === 0) {
            return res.status(401).json({ error: 'Invalid student ID or password' });
        }

        const student = result[0][0]; // Assuming there's only one student with this student_id
        console.log(student)
        // Directly compare the password entered by the user with the password stored in the database
        if (password !== student.password) {
            return res.status(401).json({ error: 'Invalid student ID or password' });
        }

        // If the password matches, return the student data
        res.status(200).json({
            success: true,
            message: 'Login successful',
            student: {
                studentId: student.student_id,
                firstName: student.first_name,
                lastName: student.last_name,
                email: student.email,
            }
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT s.student_id, s.first_name, s.last_name, s.dob, s.email,s.address, s.phone, s.gender, s.enrollment_year, d.department_name
            FROM Students s
            JOIN Departments d ON s.department_id = d.department_id;`;
        const students = await db.promise().query(query);
        res.status(200).json(students[0]);
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ error: 'Server error' });
    }
});
router.get('/admin', async (req, res) => {
    try {
        const query = `
            SELECT * FROM Students`;
        const students = await db.promise().query(query);
        res.status(200).json(students[0]);
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/admin/add', async (req, res) => {
    const { 
        student_id, first_name, last_name, dob, email, phone, address, gender, enrollment_year, department_id, password
    } = req.body;

    // Validate required fields
    if (!student_id || !first_name || !last_name || !dob || !email || !phone || !gender || !enrollment_year || !department_id || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Query to insert the student data into the Students table
        const query = `
            INSERT INTO Students 
            (student_id, first_name, last_name, dob, email, phone, address, gender, enrollment_year, department_id, password) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.promise().query(query, [
            student_id, first_name, last_name, dob, email, phone, address, gender, enrollment_year, department_id, password
        ]);

        // Return the newly created student data, including the generated student ID
        res.status(201).json({
            id: result.insertId,
            student_id, 
            first_name, 
            last_name, 
            dob, 
            email, 
            phone, 
            address, 
            gender, 
            enrollment_year, 
            department_id 
        });
    } catch (error) {
        console.error("Error adding student:", error);
        res.status(500).json({ error: 'Server error' });
    }
});



router.put('/admin/:id', async (req, res) => {
    const studentId = req.params.id;
    const { first_name, last_name, dob, email, phone, address, gender, enrollment_year, department_id } = req.body;
    try {
        const query = `
            UPDATE Students 
            SET first_name = ?, last_name = ?, dob = ?, email = ?, phone = ?, address = ?, gender = ?, enrollment_year = ?, department_id = ?
            WHERE student_id = ?
        `;
        const [result] = await db.promise().query(query, [
            first_name, last_name, dob, email, phone, address, gender, enrollment_year, department_id, studentId
        ]);
        if (result.affectedRows > 0) {
            res.status(200).json({ id: studentId, first_name, last_name, dob, email, phone, address, gender, enrollment_year, department_id });
        } else {
            res.status(404).json({ error: 'Student not found' });
        }
    } catch (error) {
        console.error("Error updating student:", error);
        res.status(500).json({ error: 'Server error' });
    }
});


router.delete('/admin/:id', async (req, res) => {
    const studentId = req.params.id;
    try {
        const query = "DELETE FROM Students WHERE student_id = ?";
        const [result] = await db.promise().query(query, [studentId]);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Student deleted' });
        } else {
            res.status(404).json({ error: 'Student not found' });
        }
    } catch (error) {
        console.error("Error deleting student:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;