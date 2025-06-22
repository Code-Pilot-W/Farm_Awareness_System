const express = require('express');
const FarmingTask = require('../models/FarmingTask');
const auth = require('../middleware/auth');
const router = express.Router();

// Get farming tasks for a specific month
router.get('/', auth, async (req, res) => {
  try {
    const { month } = req.query;
    let query = { userId: req.user.userId };
    
    if (month) {
      // Parse month (format: YYYY-MM)
      const [year, monthNum] = month.split('-');
      const startDate = new Date(year, monthNum - 1, 1);
      const endDate = new Date(year, monthNum, 0, 23, 59, 59);
      
      query.date = {
        $gte: startDate,
        $lte: endDate
      };
    }
    
    const tasks = await FarmingTask.find(query)
      .sort({ date: 1, priority: -1 })
      .lean();
    
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching farming tasks:', error);
    res.status(500).json({ 
      message: 'Failed to fetch farming tasks',
      error: error.message 
    });
  }
});

// Get upcoming tasks
router.get('/upcoming', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tasks = await FarmingTask.find({
      userId: req.user.userId,
      date: { $gte: today },
      completed: false
    })
    .sort({ date: 1, priority: -1 })
    .limit(10)
    .lean();
    
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching upcoming tasks:', error);
    res.status(500).json({ 
      message: 'Failed to fetch upcoming tasks',
      error: error.message 
    });
  }
});

// Create a new farming task
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, date, type, crop, priority } = req.body;
    
    const task = new FarmingTask({
      title,
      description,
      date: new Date(date),
      type,
      crop,
      priority,
      userId: req.user.userId
    });
    
    await task.save();
    
    res.status(201).json({
      message: 'Farming task created successfully',
      task
    });
  } catch (error) {
    console.error('Error creating farming task:', error);
    res.status(500).json({ 
      message: 'Failed to create farming task',
      error: error.message 
    });
  }
});

// Update a farming task
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Ensure user can only update their own tasks
    const task = await FarmingTask.findOne({ _id: id, userId: req.user.userId });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Update the task
    const updatedTask = await FarmingTask.findByIdAndUpdate(
      id,
      { ...updateData, date: new Date(updateData.date) },
      { new: true, runValidators: true }
    );
    
    res.json({
      message: 'Task updated successfully',
      task: updatedTask
    });
  } catch (error) {
    console.error('Error updating farming task:', error);
    res.status(500).json({ 
      message: 'Failed to update farming task',
      error: error.message 
    });
  }
});

// Delete a farming task
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Ensure user can only delete their own tasks
    const task = await FarmingTask.findOneAndDelete({ 
      _id: id, 
      userId: req.user.userId 
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting farming task:', error);
    res.status(500).json({ 
      message: 'Failed to delete farming task',
      error: error.message 
    });
  }
});

// Toggle task completion
router.patch('/:id/toggle', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const task = await FarmingTask.findOne({ _id: id, userId: req.user.userId });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    task.completed = !task.completed;
    await task.save();
    
    res.json({
      message: 'Task status updated successfully',
      task
    });
  } catch (error) {
    console.error('Error toggling task completion:', error);
    res.status(500).json({ 
      message: 'Failed to update task status',
      error: error.message 
    });
  }
});

// Get task statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const currentMonth = new Date();
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0, 23, 59, 59);
    
    const stats = await FarmingTask.aggregate([
      {
        $match: {
          userId: userId,
          date: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          totalTasks: { $sum: 1 },
          completedTasks: {
            $sum: { $cond: [{ $eq: ['$completed', true] }, 1, 0] }
          },
          highPriorityTasks: {
            $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] }
          },
          tasksByType: {
            $push: '$type'
          }
        }
      }
    ]);
    
    const result = stats[0] || {
      totalTasks: 0,
      completedTasks: 0,
      highPriorityTasks: 0,
      tasksByType: []
    };
    
    res.json(result);
  } catch (error) {
    console.error('Error fetching task statistics:', error);
    res.status(500).json({ 
      message: 'Failed to fetch task statistics',
      error: error.message 
    });
  }
});

module.exports = router;
