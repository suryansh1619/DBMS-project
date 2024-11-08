const express = require('express');
const router=express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
    try {
        const query="SELECT * FROM Departments";
        const departments = await db.promise().query(query);
        res.status(200).json(departments[0]);
    } 
    catch (error) {
        console.error("Error fetching departments:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/admin/add', async (req, res) => {
    const { department_name } = req.body;
    try {
        const query = "INSERT INTO Departments (department_name) VALUES (?)";
        const [result] = await db.promise().query(query, [department_name]);
        res.status(201).json({ id: result.insertId, department_name });
    } catch (error) {
        console.error("Error adding department:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/admin/:id', async (req, res) => {
    const departmentId = req.params.id;
    const { department_name } = req.body;
    try {
        const query = "UPDATE Departments SET department_name = ? WHERE department_id = ?";
        const [result] = await db.promise().query(query, [department_name, departmentId]);
        if (result.affectedRows > 0) {
            res.status(200).json({ id: departmentId, department_name });
        } else {
            res.status(404).json({ error: 'Department not found' });
        }
    } catch (error) {
        console.error("Error updating department:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.delete('/admin/:id', async (req, res) => {
    const departmentId = req.params.id;
    try {
        const query = "DELETE FROM Departments WHERE department_id = ?";
        const [result] = await db.promise().query(query, [departmentId]);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Department deleted' });
        } else {
            res.status(404).json({ error: 'Department not found' });
        }
    } catch (error) {
        console.error("Error deleting department:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;