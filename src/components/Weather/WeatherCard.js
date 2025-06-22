import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip
} from '@mui/material';
import {
  WbSunny,
  Cloud,
  Grain,
  Air,
  Opacity,
  Thermostat,
  Thunderstorm,
  AcUnit,
  Visibility
} from '@mui/icons-material';

const WeatherCard = ({ weather, showDetails = false }) => {
  const getWeatherIcon = (condition) => {
    const iconStyle = { fontSize: showDetails ? 80 : 40 };
    
    switch (condition?.toLowerCase()) {
      case 'sunny':
        return <WbSunny sx={{ ...iconStyle, color: '#FFA726' }} />;
      case 'cloudy':
        return <Cloud sx={{ ...iconStyle, color: '#78909C' }} />;
      case 'rainy':
        return <Grain sx={{ ...iconStyle, color: '#42A5F5' }} />;
      case 'stormy':
        return <Thunderstorm sx={{ ...iconStyle, color: '#5C6BC0' }} />;
      case 'snowy':
        return <AcUnit sx={{ ...iconStyle, color: '#E3F2FD' }} />;
      case 'foggy':
        return <Visibility sx={{ ...iconStyle, color: '#90A4AE' }} />;
      default:
        return <WbSunny sx={{ ...iconStyle, color: '#FFA726' }} />;
    }
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          {getWeatherIcon(weather.condition)}
          <Box textAlign="right">
            <Typography variant={showDetails ? "h3" : "h5"}>
              {weather.temperature}°C
            </Typography>
            <Typography variant="body2" color="textSecondary" textTransform="capitalize">
              {weather.description}
            </Typography>
          </Box>
        </Box>

        {showDetails && (
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box display="flex" alignItems="center" gap={1}>
                <Opacity fontSize="small" color="primary" />
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Humidity
                  </Typography>
                  <Typography variant="body1">
                    {weather.humidity}%
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="flex" alignItems="center" gap={1}>
                <Air fontSize="small" color="primary" />
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Wind
                  </Typography>
                  <Typography variant="body1">
                    {weather.windSpeed} km/h
                  </Typography>
                </Box>
              </Box>
            </Grid>
            {weather.pressure && (
              <Grid item xs={6}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Thermostat fontSize="small" color="primary" />
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Pressure
                    </Typography>
                    <Typography variant="body1">
                      {weather.pressure} hPa
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            )}
            {weather.feelsLike && (
              <Grid item xs={6}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Thermostat fontSize="small" color="primary" />
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Feels Like
                    </Typography>
                    <Typography variant="body1">
                      {weather.feelsLike}°C
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            )}
          </Grid>
        )}

        {!showDetails && (
          <Chip
            label={weather.condition}
            size="small"
            sx={{ textTransform: 'capitalize' }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
