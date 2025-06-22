import React, { useState } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Button,
  Box
} from '@mui/material';
import { LocationOn } from '@mui/icons-material';
import { nigeriaStates, majorNigerianCities } from '../../data/nigeriaLocations';

const LocationSelector = ({ onLocationSelect, loading }) => {
  const [selectedState, setSelectedState] = useState('');
  const [selectedLGA, setSelectedLGA] = useState('');

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
    setSelectedLGA(''); // Reset LGA when state changes
  };

  const handleLGAChange = (event) => {
    setSelectedLGA(event.target.value);
  };

  const handleGetWeather = () => {
    if (selectedState && selectedLGA) {
      // Try to find coordinates for the selected location
      const stateCapital = nigeriaStates[selectedState]?.capital;
      const cityCoords = majorNigerianCities[stateCapital] || majorNigerianCities[selectedLGA];
      
      if (cityCoords) {
        onLocationSelect(cityCoords.lat, cityCoords.lon, `${selectedLGA}, ${selectedState}`);
      } else {
        // Fallback to state capital
        const fallbackCity = majorNigerianCities[stateCapital];
        if (fallbackCity) {
          onLocationSelect(fallbackCity.lat, fallbackCity.lon, `${selectedLGA}, ${selectedState}`);
        }
      }
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Select State</InputLabel>
            <Select
              value={selectedState}
              onChange={handleStateChange}
              label="Select State"
            >
              {Object.keys(nigeriaStates).map((state) => (
                <MenuItem key={state} value={state}>
                  {state}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth disabled={!selectedState}>
            <InputLabel>Select LGA</InputLabel>
            <Select
              value={selectedLGA}
              onChange={handleLGAChange}
              label="Select LGA"
            >
              {selectedState && nigeriaStates[selectedState]?.lgas.map((lga) => (
                <MenuItem key={lga} value={lga}>
                  {lga}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<LocationOn />}
            onClick={handleGetWeather}
            disabled={!selectedState || !selectedLGA || loading}
            sx={{ height: 56 }}
          >
            Get Weather
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LocationSelector;
