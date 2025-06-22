const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const pestAlertSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  severity: {
    type: String,
    enum: ['info', 'warning', 'error'],
    default: 'warning'
  },
  crop: {
    type: String,
    required: [true, 'Crop is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  symptoms: [{
    type: String,
    trim: true
  }],
  controlMeasures: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['active', 'monitoring', 'resolved', 'critical'],
    default: 'active'
  },
  image: {
    type: String, // Store image file path
    default: null
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comments: [commentSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('PestAlert', pestAlertSchema);
