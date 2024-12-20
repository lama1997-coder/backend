const express = require('express');
const multer = require('multer');
const path = require('path');
const File = require('../models/fileModel');
const jwt = require('jsonwebtoken');
const { timeStamp } = require('console');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Token:', token);

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded:', decoded);
        req.user = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: error });
    }
};

router.post('/upload', authenticate, upload.single('file'), async (req, res) => {
    const { tags } = req.body;
    const { filename, mimetype } = req.file;
    const fileUrl = `http://64.226.83.77:3000/uploads/view/${filename}`;

    try {
        const newFile = new File({
            filename,
            fileType: mimetype,
            tags: tags.split(','),
            user: req.user,
            fileUrl: fileUrl,
        });

        await newFile.save();
        res.status(200).json({ message: 'File uploaded successfully', file: newFile, status: 1 });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/view/:filename', async (req, res) => {
    try {
        debugger
        const { filename } = req.params;
        console.log(filename)

        const file = await File.findOne({ filename: filename });

        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }
        console.log(file)

        file.views += 1;
        await file.save();
        const filePath = path.join(__dirname, '..', 'uploads', filename);
        console.log('filePath', filePath)
        console.log(filePath)

        return res.sendFile(filePath);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/view', authenticate, async (req, res) => {
    try {
        const file = await File.find({ user: req.user });

        if (!file || file.length === 0) {
            return res.status(404).json({ message: 'No files found for this user.', file: [] });
        }
        res.status(200).json({ file });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
module.exports = router;
