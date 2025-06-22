const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const News = require('../models/News');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/news/';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'news-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// GET all news
router.get('/', async (req, res) => {
  try {
    const news = await News.find().sort({ date: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single news by ID
router.get('/:id', async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new news with image upload
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const newsData = {
      title: req.body.title,
      summary: req.body.summary,
      content: req.body.content,
      category: req.body.category,
      author: req.body.author,
      location: req.body.location,
      tags: req.body.tags ? req.body.tags.split(',') : []
    };

    // Add image path if uploaded
    if (req.file) {
      newsData.image = `/uploads/news/${req.file.filename}`;
    }

    const news = new News(newsData);
    const savedNews = await news.save();
    res.status(201).json(savedNews);
  } catch (error) {
    // Delete uploaded file if news creation fails
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(400).json({ message: error.message });
  }
});

// PUT update news with optional image upload
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    const updateData = {
      title: req.body.title || news.title,
      summary: req.body.summary || news.summary,
      content: req.body.content || news.content,
      category: req.body.category || news.category,
      author: req.body.author || news.author,
      location: req.body.location || news.location,
      tags: req.body.tags ? req.body.tags.split(',') : news.tags
    };

    // Handle image update
    if (req.file) {
      // Delete old image if exists
      if (news.image) {
        const oldImagePath = path.join(__dirname, '..', news.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateData.image = `/uploads/news/${req.file.filename}`;
    }

    const updatedNews = await News.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json(updatedNews);
  } catch (error) {
    // Delete uploaded file if update fails
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(400).json({ message: error.message });
  }
});

// DELETE news
router.delete('/:id', async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    // Delete associated image file
    if (news.image) {
      const imagePath = path.join(__dirname, '..', news.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await News.findByIdAndDelete(req.params.id);
    res.json({ message: 'News deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST comment to news
router.post('/:id/comments', async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }
    
    news.comments.push(req.body);
    const updatedNews = await news.save();
    res.json(updatedNews);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT like news
router.put('/:id/like', async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    res.json(news);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT like comment
router.put('/:id/comments/:commentId/like', async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    const comment = news.comments.id(req.params.commentId);
    comment.likes = (comment.likes || 0) + 1;
    const updatedNews = await news.save();
    res.json(updatedNews);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
