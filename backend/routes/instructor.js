const express = require('express');
const router=express.Router();
const db = require('../db');

router.post('/login', async (req, res) => {
    const { username, password } = req.body; // Accepting instructorId as username and password

    if (!username || !password) {
        return res.status(400).json({ error: 'Instructor ID and password are required' });
    }

    try {
        // Query to find the instructor by instructor_id
        const query = `
            SELECT instructor_id, first_name, last_name, email, password 
            FROM Instructors 
            WHERE instructor_id = ?;
        `;
        const result = await db.promise().query(query, [username]);
        console.log(result[0])

        if (result[0].length === 0) {
            return res.status(401).json({ error: 'Invalid instructor ID or password' });
        } // Assuming there's only one instructor with this instructor_id
        instructor=result[0][0]        // Directly compare the password entered by the user with the password stored in the database
        if (password !== instructor.password) {
            return res.status(401).json({ error: 'Invalid instructor ID or password' });
        }
        // If the password matches, return the instructor data
        res.status(200).json({
            success: true,
            message: 'Login successful',
            instructor: {
                instructorId: instructor.instructor_id,
                firstName: instructor.first_name,
                lastName: instructor.last_name,
                email: instructor.email,
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
            SELECT i.instructor_id, i.first_name, i.last_name, i.email, i.phone, i.hire_date, d.department_name
            FROM Instructors i
            JOIN Departments d ON i.department_id = d.department_id;`;
        const instructors = await db.promise().query(query);
        res.status(200).json(instructors[0]);
    } catch (error) {
        console.error("Error fetching instructors:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/admin', async (req, res) => {
    try {
        const query = `
            SELECT * FROM Instructors`;
        const instructors = await db.promise().query(query);
        res.status(200).json(instructors[0]);
    } catch (error) {
        console.error("Error fetching instructors:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/admin/add', async (req, res) => {
    const { instructor_id, first_name, last_name, email, phone, hire_date, department_id, password } = req.body;

    // Ensure that all required fields are provided
    if (!instructor_id || !first_name || !last_name || !email || !department_id || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // SQL query for inserting a new instructor into the database
        const query = `
            INSERT INTO Instructors (instructor_id, first_name, last_name, email, phone, hire_date, department_id, password) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        // Execute the query and pass the data
        const [result] = await db.promise().query(query, [
            instructor_id, first_name, last_name, email, phone, hire_date, department_id, password
        ]);

        // Send the response with the added instructor data (excluding the password)
        res.status(201).json({
            id: result.insertId,
            instructor_id,
            first_name,
            last_name,
            email,
            phone,
            hire_date,
            department_id
        });
    } catch (error) {
        console.error("Error adding instructor:", error);
        res.status(500).json({ error: 'Server error' });
    }
});



router.put('/admin/:id', async (req, res) => {
    const instructorId = req.params.id; 
    const { first_name, last_name, email, phone, hire_date, department_id } = req.body; 
    try {
        const query = `
            UPDATE Instructors 
            SET first_name = ?, last_name = ?, email = ?, phone = ?, hire_date = ?, department_id = ? 
            WHERE instructor_id = ?`;
        const [result] = await db.promise().query(query, [first_name, last_name, email, phone, hire_date, department_id, instructorId]);
        if (result.affectedRows > 0) {
            res.status(200).json({ instructor_id: instructorId, first_name, last_name, email, phone, hire_date, department_id });
        } else {
            res.status(404).json({ error: 'Instructor not found' });
        }
    } catch (error) {
        console.error("Error updating instructor:", error);
        res.status(500).json({ error: 'Server error' });
    }
});



router.delete('/admin/:id', async (req, res) => {
    const instructorId = req.params.id;
    try {
        const query = "DELETE FROM Instructors WHERE instructor_id = ?";
        const [result] = await db.promise().query(query, [instructorId]);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Instructor deleted' });
        } else {
            res.status(404).json({ error: 'Instructor not found' });
        }
    } catch (error) {
        console.error("Error deleting instructor:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;