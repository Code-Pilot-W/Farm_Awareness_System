const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const PestAlert = require('../models/PestAlert');
const auth = require('../middleware/auth');

const router = express.Router();

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads/pest-alerts');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/pest-alerts/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'pest-alert-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Get all pest alerts
router.get('/', async (req, res) => {
  try {
    console.log('Fetching pest alerts...');
    const alerts = await PestAlert.find()
      .populate('postedBy', 'name email')
      .populate('comments.user', 'name')
      .sort({ createdAt: -1 });
      
    console.log(`Found ${alerts.length} alerts`);
    res.json(alerts);
  } catch (error) {
    console.error('Error fetching pest alerts:', error);
    res.status(500).json({ message: 'Failed to fetch pest alerts' });
  }
});

// Get single pest alert
router.get('/:id', async (req, res) => {
  try {
    const alert = await PestAlert.findById(req.params.id)
      .populate('postedBy', 'name email')
      .populate('comments.user', 'name');
      
    if (!alert) {
      return res.status(404).json({ message: 'Pest alert not found' });
    }
      
    res.json(alert);
  } catch (error) {
    console.error('Error fetching pest alert:', error);
    res.status(500).json({ message: 'Failed to fetch pest alert' });
  }
});

// Create new pest alert
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    console.log('Creating new pest alert...');
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    console.log('User:', req.user);

    const {
      title,
      description,
      severity,
      crop,
      location,
      symptoms,
      controlMeasures,
      status
    } = req.body;

    // Validate required fields
    if (!title || !description || !crop || !location) {
      return res.status(400).json({ 
        message: 'Title, description, crop, and location are required' 
      });
    }

    // Parse JSON strings back to arrays
    let parsedSymptoms = [];
    let parsedControlMeasures = [];

    try {
      parsedSymptoms = symptoms ? JSON.parse(symptoms) : [];
      parsedControlMeasures = controlMeasures ? JSON.parse(controlMeasures) : [];
    } catch (parseError) {
      console.error('Error parsing arrays:', parseError);
      parsedSymptoms = Array.isArray(symptoms) ? symptoms : [];
      parsedControlMeasures = Array.isArray(controlMeasures) ? controlMeasures : [];
    }

    const alertData = {
      title: title.trim(),
      description: description.trim(),
      severity: severity || 'warning',
      crop: crop.trim(),
      location: location.trim(),
      symptoms: parsedSymptoms.filter(s => s && s.trim() !== ''),
      controlMeasures: parsedControlMeasures.filter(c => c && c.trim() !== ''),
      status: status || 'active',
      postedBy: req.user.userId
    };

    // Add image path if uploaded
    if (req.file) {
      alertData.image = req.file.path;
      console.log('Image uploaded:', req.file.path);
    }

    console.log('Alert data to save:', alertData);

    const pestAlert = new PestAlert(alertData);
    const savedAlert = await pestAlert.save();
      
    console.log('Alert saved successfully:', savedAlert._id);

    // Populate the response
    await savedAlert.populate('postedBy', 'name email');
      
    res.status(201).json(savedAlert);
  } catch (error) {
    console.error('Error creating pest alert:', error);
      
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: errors.join(', ') });
    }
      
    res.status(500).json({ message: 'Failed to create pest alert: ' + error.message });
  }
});

// Update pest alert
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    console.log('Updating pest alert:', req.params.id);
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    console.log('User:', req.user);

    const alert = await PestAlert.findById(req.params.id);
    
    if (!alert) {
      return res.status(404).json({ message: 'Pest alert not found' });
    }

    // Check if user owns the alert
    if (alert.postedBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this alert' });
    }

    const {
      title,
      description,
      severity,
      crop,
      location,
      symptoms,
      controlMeasures,
      status
    } = req.body;

    // Validate required fields
    if (!title || !description || !crop || !location) {
      return res.status(400).json({ 
        message: 'Title, description, crop, and location are required' 
      });
    }

    // Parse JSON strings back to arrays
    let parsedSymptoms = [];
    let parsedControlMeasures = [];

    try {
      parsedSymptoms = symptoms ? JSON.parse(symptoms) : [];
      parsedControlMeasures = controlMeasures ? JSON.parse(controlMeasures) : [];
    } catch (parseError) {
      console.error('Error parsing arrays:', parseError);
      parsedSymptoms = Array.isArray(symptoms) ? symptoms : [];
      parsedControlMeasures = Array.isArray(controlMeasures) ? controlMeasures : [];
    }

    // Update fields
    alert.title = title.trim();
    alert.description = description.trim();
    alert.severity = severity || 'warning';
    alert.crop = crop.trim();
    alert.location = location.trim();
    alert.symptoms = parsedSymptoms.filter(s => s && s.trim() !== '');
    alert.controlMeasures = parsedControlMeasures.filter(c => c && c.trim() !== '');
    alert.status = status || 'active';

    // Handle image update
    if (req.file) {
      // Delete old image if it exists
      if (alert.image && fs.existsSync(alert.image)) {
        try {
          fs.unlinkSync(alert.image);
          console.log('Old image deleted:', alert.image);
        } catch (deleteError) {
          console.error('Error deleting old image:', deleteError);
        }
      }
      alert.image = req.file.path;
      console.log('New image uploaded:', req.file.path);
    }

    const updatedAlert = await alert.save();
    await updatedAlert.populate('postedBy', 'name email');
    
    console.log('Alert updated successfully:', updatedAlert._id);
    res.json(updatedAlert);
  } catch (error) {
    console.error('Error updating pest alert:', error);
    
    // Clean up uploaded file if there was an error
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.error('Error cleaning up file:', cleanupError);
      }
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: errors.join(', ') });
    }
    
    res.status(500).json({ message: 'Failed to update pest alert: ' + error.message });
  }
});

// Delete pest alert
router.delete('/:id', auth, async (req, res) => {
  try {
    console.log('Deleting pest alert:', req.params.id);
    console.log('User:', req.user);

    const alert = await PestAlert.findById(req.params.id);
    
    if (!alert) {
      return res.status(404).json({ message: 'Pest alert not found' });
    }

    // Check if user owns the alert
    if (alert.postedBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this alert' });
    }

    // Delete associated image file
    if (alert.image && fs.existsSync(alert.image)) {
      try {
        fs.unlinkSync(alert.image);
        console.log('Image deleted:', alert.image);
      } catch (deleteError) {
        console.error('Error deleting image:', deleteError);
      }
    }

    await PestAlert.findByIdAndDelete(req.params.id);
    
    console.log('Alert deleted successfully:', req.params.id);
    res.json({ message: 'Pest alert deleted successfully' });
  } catch (error) {
    console.error('Error deleting pest alert:', error);
    res.status(500).json({ message: 'Failed to delete pest alert: ' + error.message });
  }
});

// Add comment to pest alert
router.post('/:id/comments', auth, async (req, res) => {
  try {
    console.log('Adding comment to alert:', req.params.id);
    const { text } = req.body;
      
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const alert = await PestAlert.findById(req.params.id);
      
    if (!alert) {
      return res.status(404).json({ message: 'Pest alert not found' });
    }

    alert.comments.push({
      user: req.user.userId,
      text: text.trim()
    });

    await alert.save();
    await alert.populate('postedBy', 'name email');
    await alert.populate('comments.user', 'name');
      
    console.log('Comment added successfully');
    res.json(alert);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Failed to add comment' });
  }
});

// Update pest alert status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
      
    const alert = await PestAlert.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('postedBy', 'name email');
      
    if (!alert) {
      return res.status(404).json({ message: 'Pest alert not found' });
    }
      
    res.json(alert);
  } catch (error) {
    console.error('Error updating pest alert status:', error);
    res.status(500).json({ message: 'Failed to update pest alert status' });
  }
});

module.exports = router;
