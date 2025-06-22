const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
const pestAlertsDir = path.join(uploadsDir, 'pest-alerts');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
if (!fs.existsSync(pestAlertsDir)) {
  fs.mkdirSync(pestAlertsDir);
}

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect('mongodb://localhost:27017/farm-assist')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB error:', err));

// Add routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const newsRoutes = require('./routes/news');
app.use('/api/news', newsRoutes);

const farmingCalendarRoutes = require('./routes/farmingCalendar');
app.use('/api/farming-calendar', farmingCalendarRoutes);

const expertSupportRoutes = require('./routes/expertSupport');
app.use('/api/expert-support', expertSupportRoutes);

const pestAlertsRoutes = require('./routes/pestAlerts');
app.use('/api/pest-alerts', pestAlertsRoutes);

// Add dashboard routes
const dashboardRoutes = require('./routes/dashboard');
app.use('/api/dashboard', dashboardRoutes);

app.get('/test', (req, res) => {
  res.json({ message: 'Server works!' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
    }
  }
  
  if (error.message === 'Only image files are allowed!') {
    return res.status(400).json({ message: 'Only image files are allowed!' });
  }
  
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
