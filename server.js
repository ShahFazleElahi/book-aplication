const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Set up multer for file uploads
const upload = multer({
    dest: 'uploads/',  // Destination folder for uploaded files
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf') {
            return cb(new Error('Only PDF files are allowed'));
        }
        cb(null, true);
    }
});

app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint to upload books
app.post('/api/upload', upload.single('file'), (req, res) => {
    const { filename, originalname } = req.file;
    const newFilePath = path.join(__dirname, 'uploads', filename);

    fs.renameSync(req.file.path, newFilePath);

    res.json({ success: true, filename, title: originalname });
});

// Endpoint to get the list of books
app.get('/api/books', (req, res) => {
    fs.readdir('uploads', (err, files) => {
        if (err) return res.status(500).json({ error: 'Failed to list files' });

        const books = files.map(file => ({
            title: file,
            filename: file
        }));

        res.json(books);
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
