const express = require('express');
const multer = require('multer');
const { Pool } = require('pg');
const app = express();
const port = 3000;

// Database setup
const pool = new Pool({
  user: 'yourusername',
  host: 'localhost',
  database: 'yourdatabase',
  password: 'yourpassword',
  port: 5432,
});

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Route for uploading an image
app.post('/planets/:id/image', upload.single('image'), async (req, res) => {
  const planetId = req.params.id;
  const imagePath = req.file.path;

  try {
    const updateImageQuery = `
      UPDATE planets
      SET image=$2
      WHERE id=$1;
    `;
    await pool.query(updateImageQuery, [planetId, imagePath]);

    res.status(200).send('Image uploaded and path updated in the database.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error uploading image.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});