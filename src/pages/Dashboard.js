import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Avatar,
  LinearProgress,
  Chip,
  Paper,
  Divider
} from '@mui/material';
import {
  BugReport,
  QuestionAnswer,
  Agriculture,
  Assignment,
  WbSunny,
  Cloud,
  Grain,
  Air,
  Thermostat,
  TrendingUp,
  TrendingDown,
  Remove
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import weatherService from '../services/weatherService';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    stats: null,
    weather: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      console.log('Fetching dashboard data...');
            
      // Fetch dashboard stats
      const statsResponse = await fetch('http://localhost:5000/api/dashboard/stats');
      if (!statsResponse.ok) {
        throw new Error(`HTTP error! status: ${statsResponse.status}`);
      }
      const stats = await statsResponse.json();
      console.log('Received stats:', stats);

      // Fetch weather data using your existing weather service
      let weather = null;
      try {
        // Get user's location or default to Lagos
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            weather = await weatherService.getCurrentWeather(latitude, longitude);
            setDashboardData(prev => ({ ...prev, weather }));
          },
          async () => {
            // Fallback to Lagos coordinates if geolocation fails
            weather = await weatherService.getCurrentWeather(6.5244, 3.3792);
            setDashboardData(prev => ({ ...prev, weather }));
          }
        );
      } catch (weatherError) {
        console.error('Error fetching weather:', weatherError);
      }

      setDashboardData({
        stats,
        weather,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardData({
        stats: null,
        weather: null,
        loading: false,
        error: error.message
      });
    }
  };

  const getWeatherIcon = (condition) => {
    if (!condition) return <WbSunny />;
        
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('cloud')) return <Cloud />;
    if (lowerCondition.includes('rain')) return <Grain />;
    if (lowerCondition.includes('clear') || lowerCondition.includes('sunny')) return <WbSunny />;
    return <WbSunny />;
  };

  const getWeatherAdvice = (weather) => {
    if (!weather) return "Weather data unavailable";
        
    const temp = weather.temperature;
    const humidity = weather.humidity;
        
    if (temp > 30 && humidity < 40) {
      return "Hot and dry - Consider irrigation for crops";
    } else if (temp < 15) {
      return "Cool weather - Monitor crops for frost damage";
    } else if (humidity > 80) {
      return "High humidity - Watch for fungal diseases";
    } else if (weather.condition && weather.condition.toLowerCase().includes('rain')) {
      return "Rainy conditions - Good for irrigation, check drainage";
    } else {
      return "Good conditions for field work";
    }
  };

  // Enhanced stat card component
  const StatCard = ({ icon, title, value, color, trend, subtitle, progress }) => (
    <Card 
      sx={{ 
        height: '100%',
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        border: `1px solid ${color}20`,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100px',
          height: '100px',
          background: `radial-gradient(circle, ${color}10 0%, transparent 70%)`,
          transform: 'translate(30px, -30px)'
        }
      }}
    >
      <CardContent sx={{ position: 'relative', zIndex: 1 }}>
        <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={2}>
          <Avatar
            sx={{
              bgcolor: color,
              width: 48,
              height: 48,
              boxShadow: `0 4px 20px ${color}40`
            }}
          >
            {icon}
          </Avatar>
          {trend && (
            <Chip
              icon={trend > 0 ? <TrendingUp /> : trend < 0 ? <TrendingDown /> : <Remove />}
              label={`${trend > 0 ? '+' : ''}${trend}%`}
              size="small"
              color={trend > 0 ? 'success' : trend < 0 ? 'error' : 'default'}
              sx={{ fontSize: '0.75rem' }}
            />
          )}
        </Box>
        
        <Typography variant="h3" sx={{ fontWeight: 700, color, mb: 0.5 }}>
          {value}
        </Typography>
        
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          {title}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {subtitle}
        </Typography>

        {progress !== undefined && (
          <Box>
            <Box display="flex" justifyContent="space-between" mb={0.5}>
              <Typography variant="caption" color="text.secondary">
                Progress
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {progress}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: `${color}20`,
                '& .MuiLinearProgress-bar': {
                  bgcolor: color,
                  borderRadius: 3
                }
              }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );

  if (dashboardData.loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center"
          minHeight="60vh"
        >
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" sx={{ mt: 3, color: 'text.secondary' }}>
            Loading your farm dashboard...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (dashboardData.error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          <Typography variant="h6">
            Error loading dashboard: {dashboardData.error}
          </Typography>
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box mb={4}>
          <Typography 
            variant="h3" 
            sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}
          >
            Welcome back, {user?.name || 'User'}! 👋
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Here's what's happening on your farm today
          </Typography>
        </Box>
            
        <Grid container spacing={3}>
          {/* Enhanced Stat Cards */}
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<BugReport />}
              title="Active Alerts"
              value={dashboardData.stats?.activeAlerts || 0}
              color="#f44336"
              trend={-12}
              subtitle="Pest & Disease Alerts"
              progress={25}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<QuestionAnswer />}
              title="Pending Questions"
              value={dashboardData.stats?.pendingQuestions || 0}
              color="#ff9800"
              trend={5}
              subtitle="Expert Support"
              progress={60}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<Agriculture />}
              title="Active Crops"
              value={dashboardData.stats?.activeCrops || 0}
              color="#4caf50"
              trend={8}
              subtitle="Crop Types"
              progress={85}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<Assignment />}
              title="Pending Tasks"
              value={dashboardData.stats?.totalTasks || 0}
              color="#2196f3"
              trend={0}
              subtitle="Farm Activities"
              progress={40}
            />
          </Grid>

          {/* Enhanced Weather Widget */}
          <Grid item xs={12} md={8}>
            <Card 
              sx={{ 
                height: '100%',
                background: dashboardData.weather ? 
                  'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)' : 
                  'linear-gradient(135deg, #757575 0%, #9e9e9e 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Background Pattern */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  opacity: 0.3
                }}
              />

              <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Current Weather
                  </Typography>
                  <Chip 
                    label="Live" 
                    size="small" 
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)', 
                      color: 'white',
                      fontWeight: 600
                    }} 
                  />
                </Box>

                {dashboardData.weather ? (
                  <>
                    <Grid container spacing={3} alignItems="center" mb={3}>
                      <Grid item>
                        <Avatar
                          sx={{
                            bgcolor: 'rgba(255,255,255,0.2)',
                            width: 80,
                            height: 80,
                            fontSize: '2rem'
                          }}
                        >
                          {getWeatherIcon(dashboardData.weather.condition)}
                        </Avatar>
                      </Grid>
                      <Grid item xs>
                        <Typography variant="h2" sx={{ fontWeight: 700, mb: 0.5 }}>
                          {Math.round(dashboardData.weather.temperature)}°C
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.9, mb: 0.5 }}>
                          {dashboardData.weather.condition}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          📍 {dashboardData.weather.location}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2} sx={{ mb: 3 }}>
                      {[
                        { icon: <Grain />, label: 'Humidity', value: `${dashboardData.weather.humidity}%` },
                        { icon: <Air />, label: 'Wind Speed', value: `${dashboardData.weather.windSpeed} km/h` },
                        { icon: <Thermostat />, label: 'Feels Like', value: `${Math.round(dashboardData.weather.feelsLike || dashboardData.weather.temperature)}°C` },
                        { icon: <WbSunny />, label: 'Visibility', value: `${dashboardData.weather.visibility || 'N/A'} km` }
                      ].map((item, index) => (
                        <Grid item xs={6} sm={3} key={index}>
                          <Paper
                            sx={{
                              p: 2,
                              bgcolor: 'rgba(255,255,255,0.15)',
                              backdropFilter: 'blur(10px)',
                              border: '1px solid rgba(255,255,255,0.2)',
                              textAlign: 'center'
                            }}
                          >
                            <Box sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
                              {item.icon}
                            </Box>
                            <Typography variant="body2" sx={{ opacity: 0.8, mb: 0.5 }}>
                              {item.label}
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {item.value}
                            </Typography>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>

                    <Alert
                      severity={
                        dashboardData.weather.temperature > 35 ? "error" :
                        dashboardData.weather.temperature > 30 ? "warning" :
                        "info"
                      }
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: 'white',
                        '& .MuiAlert-icon': { color: 'white' }
                      }}
                    >
                      <Typography sx={{ fontWeight: 600 }}>
                                              🌾 Farm Advice: {getWeatherAdvice(dashboardData.weather)}
                      </Typography>
                    </Alert>
                  </>
                ) : (
                  <Box textAlign="center" py={6}>
                    <CircularProgress sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }} />
                    <Typography sx={{ opacity: 0.8 }}>
                      Loading weather data...
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Enhanced Farm Overview */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="between" mb={3}>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    🚜 Farm Overview
                  </Typography>
                </Box>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {[
                    { 
                      value: dashboardData.stats?.activeAlerts || 0, 
                      label: 'Active Alerts', 
                      color: '#f44336',
                      icon: '🚨'
                    },
                    { 
                      value: dashboardData.stats?.activeCrops || 0, 
                      label: 'Active Crops', 
                      color: '#4caf50',
                      icon: '🌱'
                    },
                    { 
                      value: dashboardData.stats?.pendingQuestions || 0, 
                      label: 'Questions', 
                      color: '#ff9800',
                      icon: '❓'
                    },
                    { 
                      value: dashboardData.stats?.totalTasks || 0, 
                      label: 'Tasks', 
                      color: '#2196f3',
                      icon: '📋'
                    }
                  ].map((item, index) => (
                    <Grid item xs={6} key={index}>
                      <Paper
                        sx={{
                          p: 2,
                          textAlign: 'center',
                          background: `linear-gradient(135deg, ${item.color}15 0%, ${item.color}05 100%)`,
                          border: `1px solid ${item.color}20`,
                          borderRadius: 2,
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: `0 8px 25px ${item.color}25`
                          }
                        }}
                      >
                        <Typography variant="h4" sx={{ mb: 1 }}>
                          {item.icon}
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: item.color, mb: 0.5 }}>
                          {item.value}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.label}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>

                <Divider sx={{ my: 2 }} />

                {/* Today's Summary */}
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    📊 Today's Summary
                  </Typography>
                  
                  {dashboardData.weather && (
                    <Paper
                      sx={{
                        p: 2,
                        background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
                        border: '1px solid #e1f5fe',
                        borderRadius: 2,
                        mb: 2
                      }}
                    >
                      <Box display="flex" alignItems="center" mb={1}>
                        <Avatar
                          sx={{
                            bgcolor: '#2196f3',
                            width: 32,
                            height: 32,
                            mr: 1.5
                          }}
                        >
                          {getWeatherIcon(dashboardData.weather.condition)}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {Math.round(dashboardData.weather.temperature)}°C, {dashboardData.weather.condition}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Perfect for {dashboardData.weather.temperature > 25 ? 'irrigation planning' : 'field work'}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  )}

                  {/* Quick Actions */}
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      🎯 Recommended Actions
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {[
                        { label: 'Check Irrigation', color: '#2196f3' },
                        { label: 'Monitor Crops', color: '#4caf50' },
                        { label: 'Review Alerts', color: '#f44336' }
                      ].map((action, index) => (
                        <Chip
                          key={index}
                          label={action.label}
                          size="small"
                          sx={{
                            bgcolor: `${action.color}15`,
                            color: action.color,
                            fontWeight: 500,
                            '&:hover': {
                              bgcolor: `${action.color}25`
                            }
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Additional Insights Row */}
          <Grid item xs={12}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                border: '1px solid #dee2e6'
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  🔍 Farm Insights
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Box textAlign="center" py={2}>
                      <Typography variant="h4" sx={{ color: '#28a745', fontWeight: 700 }}>
                        92%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Farm Health Score
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={92}
                        sx={{
                          mt: 1,
                          height: 6,
                          borderRadius: 3,
                          bgcolor: '#28a74520',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: '#28a745',
                            borderRadius: 3
                          }
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box textAlign="center" py={2}>
                      <Typography variant="h4" sx={{ color: '#17a2b8', fontWeight: 700 }}>
                        15
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Days to Next Harvest
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        Tomatoes ready soon
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box textAlign="center" py={2}>
                      <Typography variant="h4" sx={{ color: '#ffc107', fontWeight: 700 }}>
                        3.2k
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Expected Yield (kg)
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        +12% from last season
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
