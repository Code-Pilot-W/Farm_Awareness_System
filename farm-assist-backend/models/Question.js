const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Comment text is required'],
    trim: true,
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isExpertResponse: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Question title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Question description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['disease', 'pest_control', 'cultivation', 'soil', 'irrigation', 'fertilization'],
    default: 'cultivation'
  },
  crop: {
    type: String,
    required: [true, 'Crop type is required'],
    trim: true
  },
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'answered', 'closed'],
    default: 'pending'
  },
  askedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  expert: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  answer: {
    type: String,
    trim: true,
    maxlength: [3000, 'Answer cannot exceed 3000 characters']
  },
  answerDate: {
    type: Date
  },
  // Comments/responses from everyone
  comments: [commentSchema],
  images: [{
    type: String // URLs to uploaded images
  }],
  tags: [String],
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient queries
questionSchema.index({ category: 1, status: 1 });
questionSchema.index({ askedBy: 1 });
questionSchema.index({ expert: 1 });
questionSchema.index({ createdAt: -1 });

// Update status when answer is provided
questionSchema.pre('save', function(next) {
  if (this.isModified('answer') && this.answer) {
    this.status = 'answered';
    this.answerDate = new Date();
  }
  next();
});

module.exports = mongoose.model('Question', questionSchema);
