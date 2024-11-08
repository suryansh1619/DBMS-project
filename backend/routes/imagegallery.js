const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');

// Set up multer for image storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to save images
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Save with timestamp and file extension
    }
});

const upload = multer({ storage });

// Route to get all images
router.get('/', async (req, res) => {
    try {
        const query = "SELECT * FROM ImageGallery";
        const images = await db.promise().query(query);
        res.status(200).json(images[0]);
    } catch (error) {
        console.error("Error fetching images:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Route to upload an image
router.post('/admin/add', upload.single('image'), async (req, res) => {
    const imageName = req.body.image_name; // Optional: If you want to allow an image name input.
    const imageUrl = `/uploads/${req.file.filename}`;

    try {
        const query = "INSERT INTO ImageGallery (image_name, image_url) VALUES (?, ?)";
        const [result] = await db.promise().query(query, [imageName || req.file.originalname, imageUrl]);

        res.status(201).json({ id: result.insertId, image_name: imageName || req.file.originalname, image_url: imageUrl });
    } catch (error) {
        console.error("Error adding image:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Route to delete an image by ID
router.delete('/admin/delete/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
      const query = "DELETE FROM ImageGallery WHERE image_id = ?";
      await db.promise().query(query, [id]);
      res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
      console.error("Error deleting image:", error);
      res.status(500).json({ error: 'Server error' });
  }
});
// Route to edit an image by ID
router.put('/admin/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { image_name } = req.body;

  try {
      const query = "UPDATE ImageGallery SET image_name = ? WHERE image_id = ?";
      await db.promise().query(query, [image_name, id]);
      res.status(200).json({ message: 'Image updated successfully' });
  } catch (error) {
      console.error("Error updating image:", error);
      res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
