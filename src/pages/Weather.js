import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Alert,
  Box,
  Paper,
  Chip,
  Avatar,
  Fade,
  Skeleton
} from '@mui/material';
import {
  LocationOn,
  Refresh,
  TrendingUp,
  Schedule,
  Cloud
} from '@mui/icons-material';
import WeatherCard from '../components/Weather/WeatherCard';
import LocationSelector from '../components/Weather/LocationSelector';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import weatherService from '../services/weatherService';

const Weather = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async (lat, lon, locationName) => {
    setLoading(true);
    setError('');
        
    try {
      const [current, forecastData] = await Promise.all([
        weatherService.getCurrentWeather(lat, lon),
        weatherService.getWeatherForecast(lat, lon)
      ]);
            
      setCurrentWeather(current);
      setForecast(forecastData);
      setSelectedLocation(locationName || current.location);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError('Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (lat, lon, locationName) => {
    fetchWeatherData(lat, lon, locationName);
  };

  // Enhanced loading skeleton
  const WeatherSkeleton = () => (
    <Box>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Skeleton variant="text" width="60%" height={40} />
            <Skeleton variant="rectangular" width="100%" height={200} sx={{ mt: 2, borderRadius: 2 }} />
          </Paper>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        {[...Array(7)].map((_, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Paper sx={{ p: 2, borderRadius: 2 }}>
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="rectangular" width="100%" height={120} sx={{ mt: 1, borderRadius: 1 }} />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  if (loading && !currentWeather) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
        py: 4
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
              🌤️ Weather Forecast
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Nigeria Weather Information
            </Typography>
          </Box>
          <WeatherSkeleton />
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
      py: 4
    }}>
      <Container maxWidth="lg">
        {/* Enhanced Header */}
        <Fade in timeout={800}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  width: 64,
                  height: 64,
                  mr: 2,
                  boxShadow: '0 8px 32px rgba(25, 118, 210, 0.3)'
                }}
              >
                <Cloud sx={{ fontSize: 32 }} />
              </Avatar>
              <Box sx={{ textAlign: 'left' }}>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 800,
                    background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: 1.2
                  }}
                >
                  Weather Forecast
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Nigeria Weather Information
                </Typography>
              </Box>
            </Box>

            {/* Status Chips */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                icon={<LocationOn />}
                label={selectedLocation || 'Select Location'}
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
              {lastUpdated && (
                <Chip
                  icon={<Schedule />}
                  label={`Updated ${lastUpdated.toLocaleTimeString()}`}
                  color="success"
                  variant="outlined"
                  size="small"
                />
              )}
              <Chip
                icon={<TrendingUp />}
                label="Live Data"
                color="info"
                variant="outlined"
                size="small"
              />
            </Box>
          </Box>
        </Fade>

        {/* Enhanced Location Selector */}
        <Fade in timeout={1000}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationOn sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Select Location
              </Typography>
            </Box>
            <LocationSelector 
              onLocationSelect={handleLocationSelect}
              loading={loading}
            />
          </Paper>
        </Fade>

        {/* Error Alert */}
        {error && (
          <Fade in timeout={600}>
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3, 
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(244, 67, 54, 0.2)'
              }}
            >
              {error}
            </Alert>
          </Fade>
        )}

        {currentWeather && (
          <Fade in timeout={1200}>
            <Box>
              {/* Current Weather Section */}
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  mb: 6,
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 12px 40px rgba(25, 118, 210, 0.3)'
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

                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                        🌤️ Current Weather
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOn sx={{ fontSize: 20 }} />
                        <Typography variant="h6" sx={{ opacity: 0.9 }}>
                          {selectedLocation}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      icon={<Refresh />}
                      label="Live"
                      sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        fontWeight: 600,
                        animation: 'pulse 2s infinite'
                      }}
                    />
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <WeatherCard weather={currentWeather} showDetails={true} />
                    </Grid>
                  </Grid>
                </Box>
              </Paper>

              {/* 7-Day Forecast Section */}
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}
              >
                <Box sx={{ mb: 4 }}>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 700, 
                      mb: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    📅 7-Day Forecast
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Extended weather forecast for better planning
                  </Typography>
                </Box>

                <Grid container spacing={3}>
                  {forecast.map((day, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                      <Fade in timeout={1400 + (index * 100)}>
                        <Box
                          sx={{
                            transition: 'all 0.3s ease-in-out',
                            '&:hover': {
                              transform: 'translateY(-4px)'
                            }
                          }}
                        >
                          <WeatherCard
                            weather={{
                              ...day,
                              date: new Date(day.date).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric'
                              })
                            }}
                          />
                        </Box>
                      </Fade>
                    </Grid>
                  ))}
                </Grid>
              </Paper>

              {/* Weather Tips Section */}
              <Fade in timeout={1600}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    mt: 4,
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                    border: '1px solid #dee2e6'
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                    🌾 Farming Tips Based on Weather
                  </Typography>
                  <Grid container spacing={2}>
                    {[
                      { icon: '☀️', tip: 'Sunny weather is perfect for harvesting and drying crops' },
                      { icon: '🌧️', tip: 'Rainy season - ensure proper drainage and watch for fungal diseases' },
                      { icon: '💨', tip: 'Windy conditions - secure young plants and check irrigation systems' },
                      { icon: '🌡️', tip: 'High temperatures - increase watering frequency and provide shade' }
                    ].map((item, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Box
                          sx={{
                            p: 2,
                            bgcolor: 'white',
                            borderRadius: 2,
                            border: '1px solid rgba(0,0,0,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2
                          }}
                        >
                          <Typography variant="h4">{item.icon}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.tip}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Fade>
            </Box>
          </Fade>
        )}
      </Container>

      {/* Add pulse animation */}
      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.7; }
          100% { opacity: 1; }
        }
      `}</style>
    </Box>
  );
};

export default Weather;
