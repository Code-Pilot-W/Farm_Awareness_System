import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  CalendarToday,
  Agriculture,
  WaterDrop,
  BugReport,
  Add,
  Edit,
  Delete
} from '@mui/icons-material';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

const FarmingCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    type: 'planting',
    crop: '',
    priority: 'medium'
  });

  useEffect(() => {
    fetchCalendarTasks();
  }, [currentDate]);

  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  const fetchCalendarTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const token = getAuthToken();
      if (!token) {
        setError('Please login to view your farming calendar');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/farming-calendar?month=${format(currentDate, 'yyyy-MM')}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching calendar tasks:', error);
      setError('Failed to load farming tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTaskIcon = (type) => {
    switch (type) {
      case 'planting':
        return <Agriculture color="success" />;
      case 'irrigation':
        return <WaterDrop color="primary" />;
      case 'pest_control':
        return <BugReport color="error" />;
      case 'fertilization':
        return <Agriculture color="warning" />;
      default:
        return <CalendarToday />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  const handleAddTask = () => {
    setSelectedTask(null);
    setNewTask({
      title: '',
      description: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      type: 'planting',
      crop: '',
      priority: 'medium'
    });
    setDialogOpen(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setNewTask({
      ...task,
      date: format(new Date(task.date), 'yyyy-MM-dd')
    });
    setDialogOpen(true);
  };

  const handleSaveTask = async () => {
    setError('');
    try {
      const token = getAuthToken();
      if (!token) {
        setError('Please login to manage tasks');
                return;
      }

      const url = selectedTask 
        ? `http://localhost:5000/api/farming-calendar/${selectedTask._id}` 
        : 'http://localhost:5000/api/farming-calendar';
      const method = selectedTask ? 'PUT' : 'POST';
            
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        throw new Error('Failed to save task');
      }

      await fetchCalendarTasks();
      setDialogOpen(false);
      setError('');
    } catch (error) {
      console.error('Error saving task:', error);
      setError('Failed to save task. Please try again.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    setError('');
    try {
      const token = getAuthToken();
      if (!token) {
        setError('Please login to manage tasks');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/farming-calendar/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      await fetchCalendarTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task. Please try again.');
    }
  };

  const toggleTaskCompletion = async (task) => {
    setError('');
    try {
      const token = getAuthToken();
      if (!token) {
        setError('Please login to manage tasks');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/farming-calendar/${task._id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      await fetchCalendarTasks();
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task. Please try again.');
    }
  };

  const upcomingTasks = tasks.filter(task => 
    new Date(task.date) >= new Date() && !task.completed
  ).sort((a, b) => new Date(a.date) - new Date(b.date));

  const completedTasks = tasks.filter(task => task.completed);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading your farming calendar...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Farming Calendar
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddTask}
        >
          Add Task
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Upcoming Tasks */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Upcoming Tasks
              </Typography>
              {upcomingTasks.length === 0 ? (
                <Typography variant="body2" color="textSecondary" sx={{ py: 4, textAlign: 'center' }}>
                  No upcoming tasks. Click "Add Task" to create your first farming task.
                </Typography>
              ) : (
                <List>
                  {upcomingTasks.map((task) => (
                    <ListItem
                      key={task._id}
                      secondaryAction={
                        <Box>
                          <IconButton 
                            onClick={() => toggleTaskCompletion(task)}
                            color="success"
                            title="Mark as completed"
                          >
                            ✓
                          </IconButton>
                          <IconButton onClick={() => handleEditTask(task)}>
                            <Edit />
                          </IconButton>
                          <IconButton onClick={() => handleDeleteTask(task._id)}>
                            <Delete />
                          </IconButton>
                        </Box>
                      }
                    >
                      <ListItemIcon>
                        {getTaskIcon(task.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="h6">{task.title}</Typography>
                            <Chip 
                              label={task.priority}
                              color={getPriorityColor(task.priority)}
                              size="small"
                            />
                            <Chip 
                              label={task.crop}
                              color="primary"
                              variant="outlined"
                              size="small"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="textSecondary">
                              {task.description}
                            </Typography>
                            <Typography variant="body2" color="primary">
                              Due: {format(new Date(task.date), 'MMM dd, yyyy')}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Calendar Summary */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                This Month Summary
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Total Tasks: {tasks.length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Completed: {completedTasks.length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Pending: {tasks.length - completedTasks.length}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Completed Tasks
              </Typography>
              {completedTasks.length === 0 ? (
                <Typography variant="body2" color="textSecondary" sx={{ py: 2, textAlign: 'center' }}>
                  No completed tasks yet.
                </Typography>
              ) : (
                <List dense>
                  {completedTasks.slice(0, 5).map((task) => (
                    <ListItem key={task._id}>
                      <ListItemIcon>
                        {getTaskIcon(task.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={task.title}
                        secondary={format(new Date(task.date), 'MMM dd')}
                      />
                    </ListItem>
                  ))}
                  {completedTasks.length > 5 && (
                    <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', mt: 1 }}>
                      +{completedTasks.length - 5} more completed tasks
                    </Typography>
                  )}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add/Edit Task Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedTask ? 'Edit Task' : 'Add New Task'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Task Title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={newTask.date}
                onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Crop"
                value={newTask.crop}
                onChange={(e) => setNewTask({ ...newTask, crop: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Task Type</InputLabel>
                <Select
                  value={newTask.type}
                  label="Task Type"
                  onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
                >
                  <MenuItem value="planting">Planting</MenuItem>
                  <MenuItem value="irrigation">Irrigation</MenuItem>
                  <MenuItem value="fertilization">Fertilization</MenuItem>
                  <MenuItem value="pest_control">Pest Control</MenuItem>
                  <MenuItem value="harvesting">Harvesting</MenuItem>
                  <MenuItem value="soil_preparation">Soil Preparation</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={newTask.priority}
                  label="Priority"
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSaveTask} 
            variant="contained"
            disabled={!newTask.title || !newTask.crop}
          >
            {selectedTask ? 'Update' : 'Add'} Task
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FarmingCalendar;
