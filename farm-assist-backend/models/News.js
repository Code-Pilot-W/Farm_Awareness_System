const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 }
});

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  content: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Government', 'Market', 'Technology', 'Weather'],
    required: true 
  },
  author: { type: String, required: true },
  location: String,
  image: String,
  tags: [String],
  date: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  comments: [commentSchema]
});

module.exports = mongoose.model('News', newsSchema);
