const express = require('express');
const router = express.Router();
const PestAlert = require('../models/PestAlert');
const Question = require('../models/Question');
const FarmingTask = require('../models/FarmingTask');

// Dashboard stats endpoint
router.get('/stats', async (req, res) => {
  try {
    console.log('Fetching dashboard stats...');

    // Count active pest alerts
    const activeAlerts = await PestAlert.countDocuments({ 
      status: { $in: ['active', 'critical'] }
    });
    console.log('Active alerts:', activeAlerts);

    // Count pending questions
    let pendingQuestions = 0;
    try {
      pendingQuestions = await Question.countDocuments({ 
        status: 'pending' 
      });
      console.log('Pending questions:', pendingQuestions);
    } catch (error) {
      console.log('Question model not found or error:', error.message);
    }

    // Count active crops
    let activeCrops = 0;
    try {
      const activeCropsResult = await FarmingTask.aggregate([
        { $match: { completed: false } },
        { $group: { _id: "$crop" } },
        { $count: "total" }
      ]);
      activeCrops = activeCropsResult.length > 0 ? activeCropsResult[0].total : 0;
      console.log('Active crops:', activeCrops);
    } catch (error) {
      console.log('FarmingTask model not found or error:', error.message);
    }

    // Count pending tasks
    let totalTasks = 0;
    try {
      totalTasks = await FarmingTask.countDocuments({ completed: false });
      console.log('Total tasks:', totalTasks);
    } catch (error) {
      console.log('FarmingTask model not found or error:', error.message);
    }

    const stats = {
      activeAlerts,
      pendingQuestions,
      activeCrops,
      totalTasks
    };

    console.log('Sending stats:', stats);
    res.json(stats);

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
});

module.exports = router;
