import React, { createContext, useContext, useState, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);

  useEffect(() => {
    // Check for new notifications periodically
    const interval = setInterval(fetchNotifications, 30000); // Every 30 seconds
    fetchNotifications(); // Initial fetch

    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications');
      const data = await response.json();
      
      // Show new notifications
      data.forEach(notification => {
        if (!notifications.find(n => n.id === notification.id)) {
          showNotification(notification.message, notification.type);
        }
      });
      
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const showNotification = (message, severity = 'info') => {
    setCurrentNotification({ message, severity });
    setOpen(true);
  };

  const hideNotification = () => {
    setOpen(false);
  };

  const value = {
    notifications,
    showNotification,
    hideNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={hideNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {currentNotification && (
          <Alert 
            onClose={hideNotification} 
            severity={currentNotification.severity}
            sx={{ width: '100%' }}
          >
            {currentNotification.message}
          </Alert>
        )}
      </Snackbar>
    </NotificationContext.Provider>
  );
};
