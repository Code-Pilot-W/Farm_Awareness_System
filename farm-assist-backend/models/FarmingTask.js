const mongoose = require('mongoose');

const farmingTaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  date: {
    type: Date,
    required: [true, 'Task date is required']
  },
  type: {
    type: String,
    required: [true, 'Task type is required'],
    enum: ['planting', 'irrigation', 'fertilization', 'pest_control', 'harvesting', 'soil_preparation'],
    default: 'planting'
  },
  crop: {
    type: String,
    required: [true, 'Crop name is required'],
    trim: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  completed: {
    type: Boolean,
    default: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for efficient queries
farmingTaskSchema.index({ userId: 1, date: 1 });
farmingTaskSchema.index({ userId: 1, completed: 1 });

// Update completedAt when task is marked as completed
farmingTaskSchema.pre('save', function(next) {
  if (this.isModified('completed')) {
    if (this.completed) {
      this.completedAt = new Date();
    } else {
      this.completedAt = undefined;
    }
  }
  next();
});

module.exports = mongoose.model('FarmingTask', farmingTaskSchema);
