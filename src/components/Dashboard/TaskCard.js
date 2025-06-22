import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip
} from '@mui/material';
import {
  CheckCircle,
  Schedule,
  Warning
} from '@mui/icons-material';

const TaskCard = ({ tasks = [] }) => {
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <CheckCircle color="success" />;
      case 'pending':
        return <Schedule color="warning" />;
      case 'overdue':
        return <Warning color="error" />;
      default:
        return <Schedule />;
    }
  };

  const defaultTasks = [
    { id: 1, title: 'Water the crops', priority: 'high', status: 'pending' },
    { id: 2, title: 'Check pest traps', priority: 'medium', status: 'completed' },
    { id: 3, title: 'Fertilizer application', priority: 'high', status: 'pending' }
  ];

  const displayTasks = tasks.length > 0 ? tasks : defaultTasks;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Today's Tasks
        </Typography>
        <List dense>
          {displayTasks.slice(0, 3).map((task) => (
            <ListItem key={task.id}>
              <ListItemIcon>
                {getStatusIcon(task.status)}
              </ListItemIcon>
              <ListItemText
                primary={task.title}
                secondary={
                  <Chip
                    label={task.priority}
                    color={getPriorityColor(task.priority)}
                    size="small"
                  />
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
