const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT d.department_id, d.department_name, h.hod_id, h.first_name AS hod_first_name, h.last_name AS hod_last_name, h.email AS hod_email
            FROM Departments d
            LEFT JOIN HOD h ON d.department_id = h.department_id;`;
        const [hods] = await db.promise().query(query);
        res.status(200).json(hods.length > 0 ? hods : []);
    } catch (error) {
        console.error("Error fetching HODs:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/admin', async (req, res) => {
    try {
        const query = `
            SELECT * FROM HOD`;
        const [hods] = await db.promise().query(query);
        res.status(200).json(hods.length > 0 ? hods : []);
    } catch (error) {
        console.error("Error fetching HODs:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/admin/add', async (req, res) => {
    const { hod_first_name, hod_last_name, department_id, email, phone, hire_date } = req.body;
    try {
        const checkQuery = 'SELECT * FROM HOD WHERE department_id = ?';
        const [checkResult] = await db.promise().execute(checkQuery, [department_id]);

        if (checkResult.length > 0) {
            return res.status(400).json({ message: 'HOD already exists for this department.' });
        }

        const query = `
            INSERT INTO HOD (first_name, last_name, department_id, email, phone, hire_date) 
            VALUES (?, ?, ?, ?, ?, ?)`;
        await db.promise().execute(query, [hod_first_name, hod_last_name, department_id, email, phone, hire_date]);
        res.status(201).json({ message: 'HOD added successfully' });
    } catch (error) {
        console.error("Error adding HOD:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/admin/:id', async (req, res) => {
    const { id } = req.params;
    const { department_id, hod_first_name, hod_last_name, email } = req.body;
    try {
        const query = `
            UPDATE HOD 
            SET department_id = ?, first_name = ?, last_name = ?, email = ? 
            WHERE hod_id = ?`;
        const [result] = await db.promise().execute(query, [department_id, hod_first_name, hod_last_name, email, id]);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'HOD updated successfully' });
        } else {
            res.status(404).json({ message: 'HOD not found' });
        }
    } catch (error) {
        console.error("Error updating HOD:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.delete('/admin/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            DELETE FROM HOD 
            WHERE hod_id = ?`;
        const [result] = await db.promise().execute(query, [id]);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'HOD deleted successfully' });
        } else {
            res.status(404).json({ message: 'HOD not found' });
        }
    } catch (error) {
        console.error("Error deleting HOD:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
