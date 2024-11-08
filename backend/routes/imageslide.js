const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');

const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 2 * 1024 * 1024 },
});

router.get('/', async (req, res) => {
    try {
        const query = "SELECT * FROM Images";
        const images = await db.promise().query(query);
        res.status(200).json(images[0]);
    } catch (error) {
        console.error("Error fetching images:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/admin/add', upload.single('image'), async (req, res) => {
    const { content } = req.body;
    const imagePath = req.file ? req.file.path : null;

    try {
        const query = "INSERT INTO Images (content, image_path) VALUES (?, ?)";
        const [result] = await db.promise().query(query, [content, imagePath]);
        res.status(201).json({ id: result.insertId, content, imagePath });
    } catch (error) {
        console.error("Error adding image:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/admin/:id', upload.single('image'), async (req, res) => {
    const imageId = req.params.id;
    const { content } = req.body;
    const imagePath = req.file ? req.file.path : null;

    try {
        const query = "UPDATE Images SET content = ?, image_path = ? WHERE id = ?";
        const [result] = await db.promise().query(query, [content, imagePath, imageId]);
        if (result.affectedRows > 0) {
            res.status(200).json({ id: imageId, content, imagePath });
        } else {
            res.status(404).json({ error: 'Image not found' });
        }
    } catch (error) {
        console.error("Error updating image:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.delete('/admin/:id', async (req, res) => {
    const imageId = req.params.id;

    try {
        const query = "DELETE FROM Images WHERE id = ?";
        const [result] = await db.promise().query(query, [imageId]);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Image deleted' });
        } else {
            res.status(404).json({ error: 'Image not found' });
        }
    } catch (error) {
        console.error("Error deleting image:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
