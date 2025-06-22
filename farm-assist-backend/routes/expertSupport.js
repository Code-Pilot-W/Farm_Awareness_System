const express = require('express');
const Question = require('../models/Question');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all questions (public access for viewing)
router.get('/questions', async (req, res) => {
  try {
    const { category, status, page = 1, limit = 20 } = req.query;
    
    let query = {};
    if (category) query.category = category;
    if (status) query.status = status;
    
    const questions = await Question.find(query)
      .populate('askedBy', 'name location')
      .populate('expert', 'name role')
      .populate('comments.author', 'name role')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();
    
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ 
      message: 'Failed to fetch questions',
      error: error.message 
    });
  }
});

// Get questions by current user
router.get('/my-questions', auth, async (req, res) => {
  try {
    const questions = await Question.find({ askedBy: req.user.userId })
      .populate('expert', 'name role')
      .populate('comments.author', 'name role')
      .sort({ createdAt: -1 })
      .lean();
    
    res.json(questions);
  } catch (error) {
    console.error('Error fetching user questions:', error);
    res.status(500).json({ 
      message: 'Failed to fetch your questions',
      error: error.message 
    });
  }
});

// Create a new question
router.post('/questions', auth, async (req, res) => {
  try {
    const { title, description, category, crop, urgency } = req.body;
    
    const question = new Question({
      title,
      description,
      category,
      crop,
      urgency,
      askedBy: req.user.userId
    });
    
    await question.save();
    
    // Populate the question with user details
    await question.populate('askedBy', 'name location');
    
    res.status(201).json({
      message: 'Question submitted successfully',
      question
    });
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ 
      message: 'Failed to submit question',
      error: error.message 
    });
  }
});

// Update a question (only by author)
router.put('/questions/:id', auth, async (req, res) => {
  try {
    const { title, description, category, crop, urgency } = req.body;
    
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    // Check if user is the author
    if (question.askedBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You can only edit your own questions' });
    }
    
    question.title = title || question.title;
    question.description = description || question.description;
    question.category = category || question.category;
    question.crop = crop || question.crop;
    question.urgency = urgency || question.urgency;
    
    await question.save();
    await question.populate('askedBy', 'name location');
    
    res.json({
      message: 'Question updated successfully',
      question
    });
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({ 
      message: 'Failed to update question',
      error: error.message 
    });
  }
});

// Get a specific question by ID
router.get('/questions/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('askedBy', 'name location')
      .populate('expert', 'name role')
      .populate('comments.author', 'name role');
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    // Increment view count
    question.views += 1;
    await question.save();
    
    res.json(question);
  } catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).json({ 
      message: 'Failed to fetch question',
      error: error.message 
    });
  }
});

// Answer a question (experts only)
router.put('/questions/:id/answer', auth, async (req, res) => {
  try {
    const { answer } = req.body;
    
    // Check if user is expert or admin
    const user = await User.findById(req.user.userId);
    if (user.role !== 'expert' && user.role !== 'admin') {
      return res.status(403).json({ message: 'Only experts can provide official answers' });
    }
    
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    question.answer = answer;
    question.expert = req.user.userId;
    question.status = 'answered';
    question.answerDate = new Date();
    
    await question.save();
    
    // Populate and return updated question
    await question.populate('askedBy', 'name location');
    await question.populate('expert', 'name role');
    
    res.json({
      message: 'Answer submitted successfully',
      question
    });
  } catch (error) {
    console.error('Error submitting answer:', error);
    res.status(500).json({ 
      message: 'Failed to submit answer',
      error: error.message 
    });
  }
});

// Add a comment/response (anyone can comment)
router.post('/questions/:id/comments', auth, async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment text is required' });
    }
    
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    const user = await User.findById(req.user.userId);
    const isExpertResponse = user.role === 'expert' || user.role === 'admin';
    
    const newComment = {
      text: text.trim(),
      author: req.user.userId,
      isExpertResponse
    };
    
    question.comments.push(newComment);
    await question.save();
    
    // Populate the new comment
    await question.populate('comments.author', 'name role');
    
    res.status(201).json({
      message: 'Comment added successfully',
      comment: question.comments[question.comments.length - 1]
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ 
      message: 'Failed to add comment',
      error: error.message 
    });
  }
});

// Update a comment (only by comment author)
router.put('/questions/:questionId/comments/:commentId', auth, async (req, res) => {
  try {
    const { text } = req.body;
    
    const question = await Question.findById(req.params.questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    const comment = question.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Check if user is the comment author
    if (comment.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You can only edit your own comments' });
    }
    
    comment.text = text;
    await question.save();
    
    res.json({
      message: 'Comment updated successfully',
      comment
    });
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ 
      message: 'Failed to update comment',
      error: error.message 
    });
  }
});

// Delete a comment (only by comment author or admin)
router.delete('/questions/:questionId/comments/:commentId', auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    const comment = question.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    const user = await User.findById(req.user.userId);
    
    // Check if user is the comment author or admin
    if (comment.author.toString() !== req.user.userId && user.role !== 'admin') {
      return res.status(403).json({ message: 'You can only delete your own comments' });
    }
    
    question.comments.pull(req.params.commentId);
    await question.save();
    
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ 
      message: 'Failed to delete comment',
      error: error.message 
    });
  }
});

// Like/unlike a question
router.post('/questions/:id/like', auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    // Check if user already liked
    const existingLike = question.likes.find(
      like => like.user.toString() === req.user.userId
    );
    
    if (existingLike) {
      // Remove like
      question.likes = question.likes.filter(
        like => like.user.toString() !== req.user.userId
      );
    } else {
      // Add like
      question.likes.push({ user: req.user.userId });
    }
    
    await question.save();
    
    res.json({
      message: existingLike ? 'Like removed' : 'Question liked',
      likes: question.likes.length,
      isLiked: !existingLike
    });
  } catch (error) {
    console.error('Error handling like:', error);
    res.status(500).json({ 
      message: 'Failed to process like',
      error: error.message 
    });
  }
});

// Like/unlike a comment
router.post('/questions/:questionId/comments/:commentId/like', auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.questionId);
    if (!question) {
            return res.status(404).json({ message: 'Question not found' });
    }
    
    const comment = question.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Check if user already liked this comment
    const existingLike = comment.likes.find(
      like => like.user.toString() === req.user.userId
    );
    
    if (existingLike) {
      // Remove like
      comment.likes = comment.likes.filter(
        like => like.user.toString() !== req.user.userId
      );
    } else {
      // Add like
      comment.likes.push({ user: req.user.userId });
    }
    
    await question.save();
    
    res.json({
      message: existingLike ? 'Like removed from comment' : 'Comment liked',
      likes: comment.likes.length,
      isLiked: !existingLike
    });
  } catch (error) {
    console.error('Error handling comment like:', error);
    res.status(500).json({ 
      message: 'Failed to process comment like',
      error: error.message 
    });
  }
});

// Update question status (for experts to mark as in_progress)
router.patch('/questions/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    const user = await User.findById(req.user.userId);
    if (user.role !== 'expert' && user.role !== 'admin') {
      return res.status(403).json({ message: 'Only experts can update question status' });
    }
    
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    question.status = status;
    if (status === 'in_progress' && !question.expert) {
      question.expert = req.user.userId;
    }
    
    await question.save();
    await question.populate('expert', 'name role');
    
    res.json({
      message: 'Question status updated successfully',
      question
    });
  } catch (error) {
    console.error('Error updating question status:', error);
    res.status(500).json({ 
      message: 'Failed to update question status',
      error: error.message 
    });
  }
});

// Get expert statistics
router.get('/expert-stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (user.role !== 'expert' && user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const stats = await Question.aggregate([
      { $match: { expert: req.user.userId } },
      {
        $group: {
          _id: null,
          totalAnswered: { $sum: 1 },
          averageLikes: { $avg: { $size: '$likes' } },
          categoriesAnswered: { $addToSet: '$category' }
        }
      }
    ]);
    
    const pendingQuestions = await Question.countDocuments({ 
      status: 'pending' 
    });
    
    res.json({
      ...stats[0],
      pendingQuestions
    });
  } catch (error) {
    console.error('Error fetching expert stats:', error);
    res.status(500).json({ 
      message: 'Failed to fetch expert statistics',
      error: error.message 
    });
  }
});

// Delete a question (only by question author or admin)
router.delete('/questions/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    // Check if user is the author or admin
    if (question.askedBy.toString() !== req.user.userId && user.role !== 'admin') {
      return res.status(403).json({ message: 'You can only delete your own questions' });
    }
    
    await Question.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ 
      message: 'Failed to delete question',
      error: error.message 
    });
  }
});

module.exports = router;
