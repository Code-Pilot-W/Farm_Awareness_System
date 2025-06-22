import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  FormControlLabel,
  Alert,
  Tabs,
  Tab,
  Paper
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  LocationOn,
  Agriculture,
  Notifications,
  Security,
  Edit,
  Save,
  Cancel
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    farmSize: '',
    cropTypes: '',
    experience: ''
  });
  const [notifications, setNotifications] = useState({
    pestAlerts: true,
    weatherUpdates: true,
    expertAnswers: true,
    newsUpdates: false,
    marketPrices: true
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
                location: user.location || '',
        farmSize: user.farmSize || '',
        cropTypes: user.cropTypes || '',
        experience: user.experience || ''
      });
    }
  }, [user]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setMessage({ type: '', text: '' });
  };

  const handleProfileUpdate = async () => {
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(profileData)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        updateUser(updatedUser);
        setEditMode(false);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to update profile' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error updating profile' });
    }
  };

  const handleNotificationUpdate = async (setting, value) => {
    const updatedNotifications = { ...notifications, [setting]: value };
    setNotifications(updatedNotifications);

    try {
      await fetch('/api/users/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedNotifications)
      });
      setMessage({ type: 'success', text: 'Notification preferences updated!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update notifications' });
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    try {
      const response = await fetch('/api/users/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (response.ok) {
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setMessage({ type: 'success', text: 'Password changed successfully!' });
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.message || 'Failed to change password' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error changing password' });
    }
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Profile Settings
      </Typography>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 3 }}>
          {message.text}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Summary Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
              >
                <Person sx={{ fontSize: 50 }} />
              </Avatar>
              <Typography variant="h5" gutterBottom>
                {user?.name}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                {user?.role === 'farmer' ? 'Farmer' : 'Agricultural Expert'}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Member since {new Date(user?.createdAt).toLocaleDateString()}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Email color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email"
                    secondary={user?.email}
                  />
                </ListItem>
                {user?.phone && (
                  <ListItem>
                    <ListItemIcon>
                      <Phone color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Phone"
                      secondary={user.phone}
                    />
                  </ListItem>
                )}
                {user?.location && (
                  <ListItem>
                    <ListItemIcon>
                      <LocationOn color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Location"
                      secondary={user.location}
                    />
                  </ListItem>
                )}
                {user?.farmSize && (
                  <ListItem>
                    <ListItemIcon>
                      <Agriculture color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Farm Size"
                      secondary={`${user.farmSize} acres`}
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Settings Tabs */}
        <Grid item xs={12} md={8}>
          <Paper>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label="Personal Information" />
              <Tab label="Notifications" />
              <Tab label="Security" />
            </Tabs>

            {/* Personal Information Tab */}
            <TabPanel value={activeTab} index={0}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">Personal Information</Typography>
                {!editMode ? (
                  <Button
                    startIcon={<Edit />}
                    onClick={() => setEditMode(true)}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Box>
                    <Button
                      startIcon={<Cancel />}
                      onClick={() => {
                        setEditMode(false);
                        setProfileData({
                          name: user.name || '',
                          email: user.email || '',
                          phone: user.phone || '',
                          location: user.location || '',
                          farmSize: user.farmSize || '',
                          cropTypes: user.cropTypes || '',
                          experience: user.experience || ''
                        });
                      }}
                      sx={{ mr: 1 }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<Save />}
                      onClick={handleProfileUpdate}
                    >
                      Save Changes
                    </Button>
                  </Box>
                )}
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Location"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Farm Size (acres)"
                    type="number"
                    value={profileData.farmSize}
                    onChange={(e) => setProfileData({ ...profileData, farmSize: e.target.value })}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Years of Experience"
                    type="number"
                    value={profileData.experience}
                    onChange={(e) => setProfileData({ ...profileData, experience: e.target.value })}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Crop Types"
                    multiline
                    rows={3}
                    value={profileData.cropTypes}
                    onChange={(e) => setProfileData({ ...profileData, cropTypes: e.target.value })}
                    disabled={!editMode}
                    placeholder="e.g., Rice, Wheat, Corn, Vegetables..."
                  />
                </Grid>
              </Grid>
            </TabPanel>

            {/* Notifications Tab */}
            <TabPanel value={activeTab} index={1}>
              <Typography variant="h6" gutterBottom>
                Notification Preferences
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Choose what notifications you'd like to receive
              </Typography>

              <List>
                <ListItem>
                  <ListItemIcon>
                    <Notifications color="error" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Pest & Disease Alerts"
                    secondary="Get notified about pest outbreaks and disease warnings in your area"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.pestAlerts}
                        onChange={(e) => handleNotificationUpdate('pestAlerts', e.target.checked)}
                      />
                    }
                    label=""
                  />
                </ListItem>
                <Divider />
                
                <ListItem>
                  <ListItemIcon>
                    <Notifications color="info" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Weather Updates"
                    secondary="Receive weather forecasts and severe weather warnings"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.weatherUpdates}
                        onChange={(e) => handleNotificationUpdate('weatherUpdates', e.target.checked)}
                      />
                    }
                    label=""
                  />
                </ListItem>
                <Divider />
                
                <ListItem>
                  <ListItemIcon>
                    <Notifications color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Expert Answers"
                    secondary="Get notified when experts answer your questions"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.expertAnswers}
                        onChange={(e) => handleNotificationUpdate('expertAnswers', e.target.checked)}
                      />
                    }
                    label=""
                  />
                </ListItem>
                <Divider />
                
                <ListItem>
                  <ListItemIcon>
                    <Notifications color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Market Prices"
                    secondary="Receive updates on crop prices and market trends"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.marketPrices}
                        onChange={(e) => handleNotificationUpdate('marketPrices', e.target.checked)}
                      />
                    }
                    label=""
                  />
                </ListItem>
                <Divider />
                
                <ListItem>
                  <ListItemIcon>
                    <Notifications />
                  </ListItemIcon>
                  <ListItemText
                    primary="News Updates"
                    secondary="Get the latest agricultural news and research updates"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.newsUpdates}
                        onChange={(e) => handleNotificationUpdate('newsUpdates', e.target.checked)}
                      />
                    }
                    label=""
                  />
                </ListItem>
              </List>
            </TabPanel>

            {/* Security Tab */}
            <TabPanel value={activeTab} index={2}>
              <Typography variant="h6" gutterBottom>
                Security Settings
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Keep your account secure by updating your password regularly
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Current Password"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="New Password"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    startIcon={<Security />}
                    onClick={handlePasswordChange}
                    disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                  >
                    Change Password
                  </Button>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Account Security
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Two-Factor Authentication"
                    secondary="Add an extra layer of security to your account"
                  />
                  <Button variant="outlined" size="small">
                    Enable 2FA
                  </Button>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Login History"
                    secondary="View recent login activity"
                  />
                                    <Button variant="outlined" size="small">
                    View History
                  </Button>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Active Sessions"
                    secondary="Manage devices that are logged into your account"
                  />
                  <Button variant="outlined" size="small">
                    Manage Sessions
                  </Button>
                </ListItem>
              </List>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;

