const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all notices
router.get('/', async (req, res) => {
    try {
        const query = "SELECT * FROM Notices ORDER BY created_at DESC";
        const [notices] = await db.promise().query(query);
        res.status(200).json(notices);
    } catch (error) {
        console.error("Error fetching notices:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Add a new notice
router.post('/admin/add', async (req, res) => {
    const { heading, content, image_url } = req.body;
    try {
        const query = "INSERT INTO Notices (heading, content, image_url) VALUES (?, ?, ?)";
        const [result] = await db.promise().query(query, [heading, content, image_url]);
        res.status(201).json({ id: result.insertId, heading, content, image_url });
    } catch (error) {
        console.error("Error adding notice:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Edit an existing notice
router.put('/admin/:id', async (req, res) => {
    const noticeId = req.params.id;
    const { heading, content, image_url } = req.body;
    try {
        const query = "UPDATE Notices SET heading = ?, content = ?, image_url = ? WHERE notice_id = ?";
        const [result] = await db.promise().query(query, [heading, content, image_url, noticeId]);
        if (result.affectedRows > 0) {
            res.status(200).json({ id: noticeId, heading, content, image_url });
        } else {
            res.status(404).json({ error: 'Notice not found' });
        }
    } catch (error) {
        console.error("Error updating notice:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete a notice
router.delete('/admin/:id', async (req, res) => {
    const noticeId = req.params.id;
    try {
        const query = "DELETE FROM Notices WHERE notice_id = ?";
        const [result] = await db.promise().query(query, [noticeId]);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Notice deleted' });
        } else {
            res.status(404).json({ error: 'Notice not found' });
        }
    } catch (error) {
        console.error("Error deleting notice:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
