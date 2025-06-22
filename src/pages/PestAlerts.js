import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Alert,
  Box,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Fab,
  Input,
  IconButton,
  Snackbar,
  Menu,
  MenuItem as MenuItemComponent,
  Divider
} from '@mui/material';
import {
  BugReport,
  Warning,
  Info,
  CheckCircle,
  LocationOn,
  CalendarToday,
  Add,
  Send,
  PhotoCamera,
  Close,
  MoreVert,
  Edit,
  Delete,
  Cancel
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const PestAlerts = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAlert, setMenuAlert] = useState(null);
  const [alertToDelete, setAlertToDelete] = useState(null);
  const [newAlert, setNewAlert] = useState({
    title: '',
    description: '',
    severity: 'warning',
    crop: '',
    location: '',
    symptoms: [''],
    controlMeasures: [''],
    status: 'active'
  });
  const [editAlert, setEditAlert] = useState({
    title: '',
    description: '',
    severity: 'warning',
    crop: '',
    location: '',
    symptoms: [''],
    controlMeasures: [''],
    status: 'active'
  });
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchPestAlerts();
  }, []);

  const fetchPestAlerts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/pest-alerts');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAlerts(data);
    } catch (error) {
      console.error('Error fetching pest alerts:', error);
      setError('Failed to fetch pest alerts');
    }
  };

  const handleImageChange = (event, isEdit = false) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const validateForm = (alertData) => {
    if (!alertData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!alertData.description.trim()) {
      setError('Description is required');
      return false;
    }
    if (!alertData.crop.trim()) {
      setError('Crop is required');
      return false;
    }
    if (!alertData.location.trim()) {
      setError('Location is required');
      return false;
    }
    return true;
  };

  const handleCreateAlert = async () => {
    if (!validateForm(newAlert)) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      
      // Add text fields
      formData.append('title', newAlert.title.trim());
      formData.append('description', newAlert.description.trim());
      formData.append('severity', newAlert.severity);
      formData.append('crop', newAlert.crop.trim());
      formData.append('location', newAlert.location.trim());
      formData.append('status', newAlert.status);
      
      // Filter and add arrays
      const filteredSymptoms = newAlert.symptoms.filter(s => s.trim() !== '');
      const filteredMeasures = newAlert.controlMeasures.filter(c => c.trim() !== '');
      
      formData.append('symptoms', JSON.stringify(filteredSymptoms));
      formData.append('controlMeasures', JSON.stringify(filteredMeasures));
      
      // Add image if selected
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to create alerts');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/pest-alerts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // Reset form and close dialog
      setNewAlert({
        title: '',
        description: '',
        severity: 'warning',
        crop: '',
        location: '',
        symptoms: [''],
        controlMeasures: [''],
        status: 'active'
      });
      setSelectedImage(null);
      setImagePreview(null);
      setCreateDialogOpen(false);
      setSuccess('Alert created successfully!');
      
      // Refresh alerts list
      await fetchPestAlerts();
    } catch (error) {
      console.error('Error creating alert:', error);
      setError(error.message || 'Failed to create alert');
    } finally {
      setLoading(false);
    }
  };

  const handleEditAlert = async () => {
    if (!validateForm(editAlert)) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      
      // Add text fields
      formData.append('title', editAlert.title.trim());
      formData.append('description', editAlert.description.trim());
      formData.append('severity', editAlert.severity);
      formData.append('crop', editAlert.crop.trim());
      formData.append('location', editAlert.location.trim());
      formData.append('status', editAlert.status);
      
      // Filter and add arrays
      const filteredSymptoms = editAlert.symptoms.filter(s => s.trim() !== '');
      const filteredMeasures = editAlert.controlMeasures.filter(c => c.trim() !== '');
      
      formData.append('symptoms', JSON.stringify(filteredSymptoms));
      formData.append('controlMeasures', JSON.stringify(filteredMeasures));
      
      // Add image if selected
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/pest-alerts/${selectedAlert._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // Reset form and close dialog
      setSelectedImage(null);
      setImagePreview(null);
      setEditDialogOpen(false);
      setSuccess('Alert updated successfully!');
      
      // Refresh alerts list
      await fetchPestAlerts();
    } catch (error) {
      console.error('Error updating alert:', error);
      setError(error.message || 'Failed to update alert');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAlert = async () => {
    if (!alertToDelete) return;

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/pest-alerts/${alertToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      setDeleteDialogOpen(false);
      setAlertToDelete(null);
      setSuccess('Alert deleted successfully!');
      
      // Refresh alerts list
      await fetchPestAlerts();
    } catch (error) {
      console.error('Error deleting alert:', error);
      setError(error.message || 'Failed to delete alert');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event, alert) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setMenuAlert(alert);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuAlert(null);
  };

  const handleEditClick = () => {
    setSelectedAlert(menuAlert);
    setEditAlert({
      title: menuAlert.title,
      description: menuAlert.description,
      severity: menuAlert.severity,
      crop: menuAlert.crop,
      location: menuAlert.location,
      symptoms: menuAlert.symptoms.length > 0 ? menuAlert.symptoms : [''],
      controlMeasures: menuAlert.controlMeasures.length > 0 ? menuAlert.controlMeasures : [''],
      status: menuAlert.status
    });
    setImagePreview(menuAlert.image ? `http://localhost:5000/${menuAlert.image}` : null);
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setAlertToDelete(menuAlert);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const canEditOrDelete = (alert) => {
    return user && alert.postedBy && alert.postedBy._id === user.id;
  };

  const handleAddComment = async () => {
    if (!comment.trim() || !selectedAlert) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/pest-alerts/${selectedAlert._id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: comment.trim() })
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      const updatedAlert = await response.json();
      setSelectedAlert(updatedAlert);
      setComment('');
      await fetchPestAlerts();
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Failed to add comment');
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'error':
        return <Warning color="error" />;
      case 'warning':
        return <Info color="warning" />;
      case 'info':
        return <Info color="info" />;
      default:
        return <BugReport />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical':
        return 'error';
      case 'active':
        return 'warning';
      case 'monitoring':
        return 'info';
      case 'resolved':
        return 'success';
      default:
        return 'default';
    }
  };

  const handleAlertClick = (alert) => {
    setSelectedAlert(alert);
    setDialogOpen(true);
  };

  const addSymptomField = (isEdit = false) => {
    if (isEdit) {
      setEditAlert({
        ...editAlert,
        symptoms: [...editAlert.symptoms, '']
      });
    } else {
      setNewAlert({
        ...newAlert,
        symptoms: [...newAlert.symptoms, '']
      });
    }
  };

  const addControlMeasureField = (isEdit = false) => {
    if (isEdit) {
      setEditAlert({
        ...editAlert,
        controlMeasures: [...editAlert.controlMeasures, '']
      });
    } else {
      setNewAlert({
        ...newAlert,
        controlMeasures: [...newAlert.controlMeasures, '']
      });
    }
  };

  const updateSymptom = (index, value, isEdit = false) => {
    if (isEdit) {
      const updatedSymptoms = [...editAlert.symptoms];
      updatedSymptoms[index] = value;
      setEditAlert({ ...editAlert, symptoms: updatedSymptoms });
    } else {
      const updatedSymptoms = [...newAlert.symptoms];
      updatedSymptoms[index] = value;
      setNewAlert({ ...newAlert, symptoms: updatedSymptoms });
    }
  };

  const updateControlMeasure = (index, value, isEdit = false) => {
    if (isEdit) {
      const updatedMeasures = [...editAlert.controlMeasures];
      updatedMeasures[index] = value;
      setEditAlert({ ...editAlert, controlMeasures: updatedMeasures });
    } else {
      const updatedMeasures = [...newAlert.controlMeasures];
      updatedMeasures[index] = value;
      setNewAlert({ ...newAlert, controlMeasures: updatedMeasures });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Snackbar for success/error messages */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
      >
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
              open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess('')}
      >
        <Alert severity="success" onClose={() => setSuccess('')}>
          {success}
        </Alert>
      </Snackbar>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Pest & Disease Alerts
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {alerts.map((alert) => (
          <Grid item xs={12} md={6} lg={4} key={alert._id}>
            <Card 
              sx={{
                height: '100%',
                cursor: 'pointer',
                '&:hover': { elevation: 4 }
              }}
              onClick={() => handleAlertClick(alert)}
            >
              {alert.image && (
                <CardMedia
                  component="img"
                  height="200"
                  image={`http://localhost:5000/${alert.image}`}
                  alt={alert.title}
                />
              )}
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  {getSeverityIcon(alert.severity)}
                  <Typography variant="h6" sx={{ ml: 1, flexGrow: 1 }}>
                    {alert.title}
                  </Typography>
                  <Chip
                    label={alert.status}
                    color={getStatusColor(alert.status)}
                    size="small"
                  />
                  {canEditOrDelete(alert) && (
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, alert)}
                      sx={{ ml: 1 }}
                    >
                      <MoreVert />
                    </IconButton>
                  )}
                </Box>
                
                <Alert severity={alert.severity} sx={{ mb: 2 }}>
                  {alert.description}
                </Alert>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    <LocationOn sx={{ fontSize: 16, mr: 0.5 }} />
                    {alert.location}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    <CalendarToday sx={{ fontSize: 16, mr: 0.5 }} />
                    {new Date(alert.createdAt).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Posted by: {alert.postedBy?.name}
                  </Typography>
                </Box>

                <Chip
                  label={alert.crop}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Show message if no alerts */}
      {alerts.length === 0 && (
        <Box textAlign="center" mt={4}>
          <Typography variant="h6" color="textSecondary">
            No pest alerts found. Create the first one!
          </Typography>
        </Box>
      )}

      {/* Menu for Edit/Delete */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItemComponent onClick={handleEditClick}>
          <Edit sx={{ mr: 1 }} />
          Edit
        </MenuItemComponent>
        <MenuItemComponent onClick={handleDeleteClick}>
          <Delete sx={{ mr: 1 }} />
          Delete
        </MenuItemComponent>
      </Menu>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setCreateDialogOpen(true)}
      >
        <Add />
      </Fab>

      {/* Create Alert Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create Pest Alert</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Alert Title"
                value={newAlert.title}
                onChange={(e) => setNewAlert({ ...newAlert, title: e.target.value })}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={newAlert.description}
                onChange={(e) => setNewAlert({ ...newAlert, description: e.target.value })}
                required
              />
            </Grid>

            {/* Image Upload Section */}
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Upload Image (Optional)
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="image-upload"
                    type="file"
                    onChange={handleImageChange}
                  />
                  <label htmlFor="image-upload">
                    <IconButton color="primary" aria-label="upload picture" component="span">
                      <PhotoCamera />
                    </IconButton>
                  </label>
                  <Typography variant="body2" color="textSecondary">
                    Choose an image to help identify the pest or disease
                  </Typography>
                </Box>
                
                {imagePreview && (
                  <Box sx={{ mt: 2, position: 'relative', display: 'inline-block' }}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        maxWidth: '200px',
                        maxHeight: '200px',
                        objectFit: 'cover',
                        borderRadius: '8px'
                      }}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        bgcolor: 'background.paper',
                        '&:hover': { bgcolor: 'grey.100' }
                      }}
                      onClick={removeImage}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Severity</InputLabel>
                <Select
                  value={newAlert.severity}
                  label="Severity"
                  onChange={(e) => setNewAlert({ ...newAlert, severity: e.target.value })}
                >
                  <MenuItem value="info">Info</MenuItem>
                  <MenuItem value="warning">Warning</MenuItem>
                  <MenuItem value="error">Critical</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Crop"
                value={newAlert.crop}
                onChange={(e) => setNewAlert({ ...newAlert, crop: e.target.value })}
                required
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Location"
                value={newAlert.location}
                onChange={(e) => setNewAlert({ ...newAlert, location: e.target.value })}
                required
              />
            </Grid>
            
            {/* Symptoms */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Symptoms</Typography>
              {newAlert.symptoms.map((symptom, index) => (
                <TextField
                  key={index}
                  fullWidth
                  label={`Symptom ${index + 1}`}
                  value={symptom}
                  onChange={(e) => updateSymptom(index, e.target.value)}
                  sx={{ mb: 1 }}
                />
              ))}
              <Button onClick={() => addSymptomField()} size="small">Add Symptom</Button>
            </Grid>

            {/* Control Measures */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Control Measures</Typography>
              {newAlert.controlMeasures.map((measure, index) => (
                <TextField
                  key={index}
                  fullWidth
                  label={`Control Measure ${index + 1}`}
                  value={measure}
                  onChange={(e) => updateControlMeasure(index, e.target.value)}
                  sx={{ mb: 1 }}
                />
              ))}
              <Button onClick={() => addControlMeasureField()} size="small">Add Control Measure</Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateAlert}
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Alert'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Alert Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Pest Alert</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Alert Title"
                value={editAlert.title}
                onChange={(e) => setEditAlert({ ...editAlert, title: e.target.value })}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={editAlert.description}
                onChange={(e) => setEditAlert({ ...editAlert, description: e.target.value })}
                required
              />
            </Grid>

            {/* Image Upload Section */}
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Upload Image (Optional)
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="edit-image-upload"
                    type="file"
                    onChange={(e) => handleImageChange(e, true)}
                  />
                  <label htmlFor="edit-image-upload">
                    <IconButton color="primary" aria-label="upload picture" component="span">
                      <PhotoCamera />
                    </IconButton>
                  </label>
                  <Typography variant="body2" color="textSecondary">
                    Choose an image to help identify the pest or disease
                  </Typography>
                </Box>
                
                {imagePreview && (
                  <Box sx={{ mt: 2, position: 'relative', display: 'inline-block' }}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        maxWidth: '200px',
                        maxHeight: '200px',
                        objectFit: 'cover',
                        borderRadius: '8px'
                      }}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        bgcolor: 'background.paper',
                        '&:hover': { bgcolor: 'grey.100' }
                      }}
                      onClick={removeImage}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Severity</InputLabel>
                <Select
                  value={editAlert.severity}
                  label="Severity"
                  onChange={(e) => setEditAlert({ ...editAlert, severity: e.target.value })}
                >
                  <MenuItem value="info">Info</MenuItem>
                  <MenuItem value="warning">Warning</MenuItem>
                  <MenuItem value="error">Critical</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Crop"
                value={editAlert.crop}
                onChange={(e) => setEditAlert({ ...editAlert, crop: e.target.value })}
                required
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={editAlert.status}
                  label="Status"
                  onChange={(e) => setEditAlert({ ...editAlert, status: e.target.value })}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="monitoring">Monitoring</MenuItem>
                  <MenuItem value="resolved">Resolved</MenuItem>
                  <MenuItem value="critical">Critical</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                value={editAlert.location}
                onChange={(e) => setEditAlert({ ...editAlert, location: e.target.value })}
                required
              />
            </Grid>
            
            {/* Symptoms */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Symptoms</Typography>
              {editAlert.symptoms.map((symptom, index) => (
                <TextField
                  key={index}
                  fullWidth
                  label={`Symptom ${index + 1}`}
                  value={symptom}
                  onChange={(e) => updateSymptom(index, e.target.value, true)}
                  sx={{ mb: 1 }}
                />
              ))}
              <Button onClick={() => addSymptomField(true)} size="small">Add Symptom</Button>
            </Grid>

            {/* Control Measures */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Control Measures</Typography>
              {editAlert.controlMeasures.map((measure, index) => (
                <TextField
                  key={index}
                  fullWidth
                  label={`Control Measure ${index + 1}`}
                  value={measure}
                  onChange={(e) => updateControlMeasure(index, e.target.value, true)}
                  sx={{ mb: 1 }}
                />
              ))}
              <Button onClick={() => addControlMeasureField(true)} size="small">Add Control Measure</Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleEditAlert}
            variant="contained"
            disabled={loading}
          >
                        {loading ? 'Updating...' : 'Update Alert'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Alert</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the alert "{alertToDelete?.title}"? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteAlert}
            color="error"
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert Details Dialog */}
      <Dialog 
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedAlert && (
          <>
            <DialogTitle>
              <Box display="flex" alignItems="center">
                {getSeverityIcon(selectedAlert.severity)}
                <Typography variant="h6" sx={{ ml: 1 }}>
                  {selectedAlert.title}
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              {selectedAlert.image && (
                <Box sx={{ mb: 3, textAlign: 'center' }}>
                  <img
                    src={`http://localhost:5000/${selectedAlert.image}`}
                    alt={selectedAlert.title}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '300px',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                  />
                </Box>
              )}

              <Alert severity={selectedAlert.severity} sx={{ mb: 3 }}>
                {selectedAlert.description}
              </Alert>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom color="error">
                    Symptoms to Look For:
                  </Typography>
                  <List dense>
                    {selectedAlert.symptoms?.map((symptom, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <BugReport color="error" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={symptom} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom color="success.main">
                    Control Measures:
                  </Typography>
                  <List dense>
                    {selectedAlert.controlMeasures?.map((measure, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <CheckCircle color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={measure} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="textSecondary">
                  <strong>Affected Crop:</strong> {selectedAlert.crop}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Location:</strong> {selectedAlert.location}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Posted by:</strong> {selectedAlert.postedBy?.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Date:</strong> {new Date(selectedAlert.createdAt).toLocaleDateString()}
                </Typography>
              </Box>

              {/* Comments Section */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>Comments</Typography>
                {selectedAlert.comments?.map((comment, index) => (
                  <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                    <Typography variant="body2">
                      <strong>{comment.user?.name}:</strong> {comment.text}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(comment.date).toLocaleDateString()}
                    </Typography>
                  </Box>
                ))}
                
                {user && (
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<Send />}
                      onClick={handleAddComment}
                    >
                      Send
                    </Button>
                  </Box>
                )}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default PestAlerts;
