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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  LinearProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Fab
} from '@mui/material';
import {
  Add,
  Agriculture,
  WaterDrop,
  Thermostat,
  Eco,
  CalendarToday,
  TrendingUp,
  Warning
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const CropMonitoring = () => {
  const { user } = useAuth();
  const [crops, setCrops] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [newCrop, setNewCrop] = useState({
    name: '',
    variety: '',
    plantingDate: '',
    expectedHarvest: '',
    area: '',
    location: '',
    stage: 'seedling'
  });

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      const response = await fetch('/api/crop-monitoring', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setCrops(data);
    } catch (error) {
      console.error('Error fetching crops:', error);
    }
  };

  const handleAddCrop = async () => {
    try {
      const response = await fetch('/api/crop-monitoring', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newCrop)
      });

      if (response.ok) {
        fetchCrops();
        setDialogOpen(false);
        setNewCrop({
          name: '',
          variety: '',
          plantingDate: '',
          expectedHarvest: '',
          area: '',
          location: '',
          stage: 'seedling'
        });
      }
    } catch (error) {
      console.error('Error adding crop:', error);
    }
  };

  const getStageColor = (stage) => {
    switch (stage) {
      case 'seedling': return 'info';
      case 'vegetative': return 'primary';
      case 'flowering': return 'secondary';
      case 'fruiting': return 'warning';
      case 'harvest': return 'success';
      default: return 'default';
    }
  };

  const getHealthColor = (health) => {
    switch (health) {
      case 'excellent': return 'success';
      case 'good': return 'info';
      case 'fair': return 'warning';
      case 'poor': return 'error';
      default: return 'default';
    }
  };

  const calculateDaysToHarvest = (expectedHarvest) => {
    const today = new Date();
    const harvestDate = new Date(expectedHarvest);
    const diffTime = harvestDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getGrowthProgress = (plantingDate, expectedHarvest) => {
    const planted = new Date(plantingDate);
    const harvest = new Date(expectedHarvest);
    const today = new Date();
    
    const totalDays = (harvest - planted) / (1000 * 60 * 60 * 24);
    const daysPassed = (today - planted) / (1000 * 60 * 60 * 24);
    
    return Math.min(Math.max((daysPassed / totalDays) * 100, 0), 100);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Crop Monitoring
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {crops.map((crop) => (
          <Grid item xs={12} md={6} lg={4} key={crop._id}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                '&:hover': { elevation: 4 }
              }}
              onClick={() => {
                setSelectedCrop(crop);
                setDetailDialogOpen(true);
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Agriculture color="success" sx={{ mr: 1 }} />
                  <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    {crop.name}
                  </Typography>
                  <Chip
                    label={crop.stage}
                    color={getStageColor(crop.stage)}
                    size="small"
                  />
                </Box>

                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Variety: {crop.variety}
                </Typography>
                
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Location: {crop.location} • Area: {crop.area} acres
                </Typography>

                {/* Growth Progress */}
                <Box sx={{ mt: 2, mb: 2 }}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Growth Progress</Typography>
                    <Typography variant="body2">
                                            {Math.round(getGrowthProgress(crop.plantingDate, crop.expectedHarvest))}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={getGrowthProgress(crop.plantingDate, crop.expectedHarvest)}
                    color="success"
                  />
                </Box>

                {/* Health Status */}
                <Box display="flex" alignItems="center" mb={2}>
                  <Typography variant="body2" sx={{ mr: 1 }}>Health:</Typography>
                  <Chip
                    label={crop.health || 'good'}
                    color={getHealthColor(crop.health || 'good')}
                    size="small"
                  />
                </Box>

                {/* Days to Harvest */}
                <Box display="flex" alignItems="center" mb={2}>
                  <CalendarToday sx={{ fontSize: 16, mr: 1 }} />
                  <Typography variant="body2">
                    {calculateDaysToHarvest(crop.expectedHarvest) > 0 
                      ? `${calculateDaysToHarvest(crop.expectedHarvest)} days to harvest`
                      : 'Ready for harvest'
                    }
                  </Typography>
                </Box>

                {/* Recent Metrics */}
                {crop.latestMetrics && (
                  <Box sx={{ mt: 2 }}>
                    <Grid container spacing={1}>
                      <Grid item xs={4}>
                        <Box textAlign="center">
                          <Thermostat color="error" sx={{ fontSize: 20 }} />
                          <Typography variant="caption" display="block">
                            {crop.latestMetrics.temperature}°C
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box textAlign="center">
                          <WaterDrop color="primary" sx={{ fontSize: 20 }} />
                          <Typography variant="caption" display="block">
                            {crop.latestMetrics.soilMoisture}%
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box textAlign="center">
                          <Eco color="success" sx={{ fontSize: 20 }} />
                          <Typography variant="caption" display="block">
                            pH {crop.latestMetrics.soilPH}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {/* Alerts */}
                {crop.alerts && crop.alerts.length > 0 && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      {crop.alerts.length} active alert{crop.alerts.length > 1 ? 's' : ''}
                    </Typography>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Empty State */}
        {crops.length === 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <Agriculture sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  No crops being monitored
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  Start monitoring your crops to track their growth and health
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setDialogOpen(true)}
                >
                  Add First Crop
                </Button>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Floating Action Button */}
      {crops.length > 0 && (
        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => setDialogOpen(true)}
        >
          <Add />
        </Fab>
      )}

      {/* Add Crop Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Crop</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Crop Name"
                value={newCrop.name}
                onChange={(e) => setNewCrop({ ...newCrop, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Variety"
                value={newCrop.variety}
                onChange={(e) => setNewCrop({ ...newCrop, variety: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Planting Date"
                type="date"
                value={newCrop.plantingDate}
                onChange={(e) => setNewCrop({ ...newCrop, plantingDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Expected Harvest Date"
                type="date"
                value={newCrop.expectedHarvest}
                onChange={(e) => setNewCrop({ ...newCrop, expectedHarvest: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Area (acres)"
                type="number"
                value={newCrop.area}
                onChange={(e) => setNewCrop({ ...newCrop, area: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                value={newCrop.location}
                onChange={(e) => setNewCrop({ ...newCrop, location: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Growth Stage</InputLabel>
                <Select
                  value={newCrop.stage}
                  label="Growth Stage"
                  onChange={(e) => setNewCrop({ ...newCrop, stage: e.target.value })}
                >
                  <MenuItem value="seedling">Seedling</MenuItem>
                  <MenuItem value="vegetative">Vegetative</MenuItem>
                  <MenuItem value="flowering">Flowering</MenuItem>
                  <MenuItem value="fruiting">Fruiting</MenuItem>
                  <MenuItem value="harvest">Ready for Harvest</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddCrop} variant="contained">Add Crop</Button>
        </DialogActions>
      </Dialog>

      {/* Crop Detail Dialog */}
      <Dialog 
        open={detailDialogOpen} 
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedCrop && (
          <>
            <DialogTitle>
              <Box display="flex" alignItems="center">
                <Agriculture color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  {selectedCrop.name} - {selectedCrop.variety}
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                {/* Basic Information */}
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Basic Information
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemText
                            primary="Location"
                            secondary={selectedCrop.location}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Area"
                            secondary={`${selectedCrop.area} acres`}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Planting Date"
                            secondary={new Date(selectedCrop.plantingDate).toLocaleDateString()}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Expected Harvest"
                            secondary={new Date(selectedCrop.expectedHarvest).toLocaleDateString()}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Current Stage"
                            secondary={
                              <Chip
                                label={selectedCrop.stage}
                                color={getStageColor(selectedCrop.stage)}
                                size="small"
                              />
                            }
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Growth Progress */}
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Growth Progress
                      </Typography>
                      <Box sx={{ mb: 3 }}>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Typography variant="body2">Overall Progress</Typography>
                          <Typography variant="body2">
                            {Math.round(getGrowthProgress(selectedCrop.plantingDate, selectedCrop.expectedHarvest))}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={getGrowthProgress(selectedCrop.plantingDate, selectedCrop.expectedHarvest)}
                          color="success"
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                      
                      <Box display="flex" alignItems="center" mb={2}>
                        <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {calculateDaysToHarvest(selectedCrop.expectedHarvest) > 0 
                            ? `${calculateDaysToHarvest(selectedCrop.expectedHarvest)} days to harvest`
                            : 'Ready for harvest'
                          }
                        </Typography>
                      </Box>

                      <Box display="flex" alignItems="center">
                        <Typography variant="body2" sx={{ mr: 1 }}>Health Status:</Typography>
                        <Chip
                          label={selectedCrop.health || 'good'}
                          color={getHealthColor(selectedCrop.health || 'good')}
                          size="small"
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Environmental Metrics */}
                {selectedCrop.latestMetrics && (
                  <Grid item xs={12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Latest Environmental Metrics
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={4}>
                            <Box textAlign="center" p={2}>
                              <Thermostat color="error" sx={{ fontSize: 40, mb: 1 }} />
                              <Typography variant="h6">
                                {selectedCrop.latestMetrics.temperature}°C
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Temperature
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Box textAlign="center" p={2}>
                              <WaterDrop color="primary" sx={{ fontSize: 40, mb: 1 }} />
                              <Typography variant="h6">
                                {selectedCrop.latestMetrics.soilMoisture}%
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Soil Moisture
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Box textAlign="center" p={2}>
                              <Eco color="success" sx={{ fontSize: 40, mb: 1 }} />
                              <Typography variant="h6">
                                {selectedCrop.latestMetrics.soilPH}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Soil pH
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                )}

                {/* Alerts and Recommendations */}
                {selectedCrop.alerts && selectedCrop.alerts.length > 0 && (
                  <Grid item xs={12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Active Alerts
                        </Typography>
                        {selectedCrop.alerts.map((alert, index) => (
                          <Alert key={index} severity="warning" sx={{ mb: 1 }}>
                            <Typography variant="body2">
                              {alert.message}
                            </Typography>
                          </Alert>
                        ))}
                      </CardContent>
                    </Card>
                  </Grid>
                )}

                {/* Recent Activities */}
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Recent Activities
                      </Typography>
                      <List>
                        <ListItem>
                          <ListItemIcon>
                            <TrendingUp color="success" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Growth stage updated"
                            secondary="2 days ago"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <WaterDrop color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Irrigation completed"
                            secondary="5 days ago"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <Warning color="warning" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Pest alert resolved"
                            secondary="1 week ago"
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
              <Button variant="contained" color="primary">
                Update Metrics
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default CropMonitoring;

