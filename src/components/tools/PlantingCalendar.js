import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { Agriculture, WbSunny, Cloud } from '@mui/icons-material';

const PlantingCalendar = () => {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('');

  const nigerianRegions = [
    { value: 'north', label: 'Northern Nigeria (Sahel/Sudan Savanna)' },
    { value: 'middle-belt', label: 'Middle Belt (Guinea Savanna)' },
    { value: 'south-west', label: 'South West (Forest Zone)' },
    { value: 'south-east', label: 'South East (Forest Zone)' },
    { value: 'south-south', label: 'South South (Coastal/Niger Delta)' }
  ];

  const crops = [
    'Maize', 'Rice', 'Cassava', 'Yam', 'Sweet Potato', 'Cowpea', 
    'Groundnut', 'Soybean', 'Millet', 'Sorghum', 'Cocoa', 'Oil Palm'
  ];

  const plantingData = {
    'north': {
      'Maize': {
        seasons: [
          { season: 'Wet Season', months: 'May - July', harvest: 'August - October', notes: 'Main season, rain-fed' },
          { season: 'Dry Season', months: 'November - January', harvest: 'February - April', notes: 'Irrigation required' }
        ]
      },
      'Rice': {
        seasons: [
          { season: 'Wet Season', months: 'June - August', harvest: 'October - December', notes: 'Upland rice, rain-fed' },
          { season: 'Dry Season', months: 'November - February', harvest: 'March - May', notes: 'Lowland rice, irrigation' }
        ]
      },
      'Millet': {
        seasons: [
          { season: 'Wet Season', months: 'May - July', harvest: 'September - November', notes: 'Drought tolerant, main season' }
        ]
      },
      'Sorghum': {
        seasons: [
          { season: 'Wet Season', months: 'May - July', harvest: 'September - November', notes: 'Drought resistant crop' }
        ]
      },
      'Cowpea': {
        seasons: [
          { season: 'Wet Season', months: 'June - August', harvest: 'September - November', notes: 'Nitrogen fixing legume' }
        ]
      },
      'Groundnut': {
        seasons: [
          { season: 'Wet Season', months: 'May - July', harvest: 'September - November', notes: 'Sandy soils preferred' }
        ]
      }
    },
    'middle-belt': {
      'Maize': {
        seasons: [
          { season: 'First Season', months: 'April - June', harvest: 'July - September', notes: 'Early rains season' },
          { season: 'Second Season', months: 'July - September', harvest: 'October - December', notes: 'Late rains season' }
        ]
      },
      'Rice': {
        seasons: [
          { season: 'Wet Season', months: 'May - July', harvest: 'September - November', notes: 'Lowland and upland varieties' }
        ]
      },
      'Yam': {
        seasons: [
          { season: 'Main Season', months: 'March - May', harvest: 'October - December', notes: 'Plant before heavy rains' }
        ]
      },
      'Cassava': {
        seasons: [
          { season: 'Year Round', months: 'March - October', harvest: '8-18 months later', notes: 'Can plant most months' }
        ]
      },
      'Soybean': {
        seasons: [
          { season: 'Wet Season', months: 'May - July', harvest: 'September - November', notes: 'Good protein source' }
        ]
      },
      'Sweet Potato': {
        seasons: [
          { season: 'Wet Season', months: 'April - August', harvest: '3-4 months later', notes: 'Multiple harvests possible' }
        ]
      }
    },
    'south-west': {
      'Maize': {
        seasons: [
          { season: 'First Season', months: 'March - May', harvest: 'June - August', notes: 'Early rains' },
          { season: 'Second Season', months: 'August - October', harvest: 'November - January', notes: 'Late rains' }
        ]
      },
      'Cassava': {
        seasons: [
          { season: 'Year Round', months: 'Any time', harvest: '8-18 months later', notes: 'Staple crop, drought tolerant' }
        ]
      },
      'Yam': {
        seasons: [
          { season: 'Main Season', months: 'February - April', harvest: 'September - December', notes: 'Before heavy rains start' }
        ]
      },
      'Cocoa': {
        seasons: [
          { season: 'Wet Season', months: 'April - July', harvest: 'Year 3 onwards', notes: 'Perennial crop, shade required' }
        ]
      },
      'Oil Palm': {
        seasons: [
          { season: 'Wet Season', months: 'April - July', harvest: 'Year 3 onwards', notes: 'Perennial, high rainfall areas' }
        ]
      },
      'Sweet Potato': {
        seasons: [
          { season: 'Year Round', months: 'March - November', harvest: '3-4 months later', notes: 'Multiple seasons possible' }
        ]
      }
    },
    'south-east': {
      'Cassava': {
        seasons: [
          { season: 'Year Round', months: 'Any time', harvest: '8-18 months later', notes: 'Main staple crop' }
        ]
      },
      'Yam': {
        seasons: [
          { season: 'Main Season', months: 'February - April', harvest: 'September - December', notes: 'Cultural significance' }
        ]
      },
      'Maize': {
        seasons: [
          { season: 'First Season', months: 'March - May', harvest: 'June - August', notes: 'Early season' },
          { season: 'Second Season', months: 'August - October', harvest: 'November - January', notes: 'Late season' }
        ]
      },
      'Rice': {
        seasons: [
          { season: 'Wet Season', months: 'April - June', harvest: 'August - October', notes: 'Swamp rice varieties' }
        ]
      },
      'Cowpea': {
        seasons: [
          { season: 'Dry Season', months: 'November - January', harvest: 'February - April', notes: 'Fadama farming' }
        ]
      },
      'Oil Palm': {
        seasons: [
          { season: 'Wet Season', months: 'April - July', harvest: 'Year 3 onwards', notes: 'Traditional crop' }
        ]
      }
    },
    'south-south': {
      'Cassava': {
        seasons: [
          { season: 'Year Round', months: 'Any time', harvest: '8-18 months later', notes: 'Flood resistant varieties' }
        ]
      },
      'Oil Palm': {
        seasons: [
          { season: 'Year Round', months: 'March - September', harvest: 'Year 3 onwards', notes: 'Ideal climate conditions' }
        ]
      },
      'Rice': {
        seasons: [
          { season: 'Wet Season', months: 'April - July', harvest: 'August - November', notes: 'Swamp and upland rice' }
        ]
      },
      'Sweet Potato': {
        seasons: [
          { season: 'Year Round', months: 'Any time', harvest: '3-4 months later', notes: 'Flood tolerant varieties' }
        ]
      },
      'Yam': {
        seasons: [
          { season: 'Main Season', months: 'February - April', harvest: 'September - December', notes: 'Water yam varieties' }
        ]
      },
      'Maize': {
        seasons: [
          { season: 'First Season', months: 'March - May', harvest: 'June - August', notes: 'Early maturing varieties' },
          { season: 'Second Season', months: 'August - October', harvest: 'November - January', notes: 'Late season planting' }
        ]
      }
    }
  };

  const getCurrentRecommendations = () => {
    if (!selectedRegion || !selectedCrop) return null;
    
    const currentMonth = new Date().getMonth() + 1;
    const cropData = plantingData[selectedRegion]?.[selectedCrop];
    
    if (!cropData) return null;

    return cropData.seasons;
  };

  const getSeasonColor = (season) => {
    if (season.includes('Wet') || season.includes('First')) return 'primary';
    if (season.includes('Dry') || season.includes('Second')) return 'secondary';
    return 'default';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <Agriculture sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
        <Typography variant="h4" gutterBottom>
          Nigerian Planting Calendar
        </Typography>
      </Box>
      
      <Typography variant="h6" color="textSecondary" paragraph>
        Find the optimal planting times for crops in different Nigerian regions
      </Typography>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Select Region</InputLabel>
            <Select
              value={selectedRegion}
              label="Select Region"
              onChange={(e) => setSelectedRegion(e.target.value)}
            >
              {nigerianRegions.map((region) => (
                <MenuItem key={region.value} value={region.value}>
                  {region.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Select Crop</InputLabel>
            <Select
              value={selectedCrop}
              label="Select Crop"
              onChange={(e) => setSelectedCrop(e.target.value)}
            >
              {crops.map((crop) => (
                <MenuItem key={crop} value={crop}>
                  {crop}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {selectedRegion && selectedCrop && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {selectedCrop} Planting Schedule - {nigerianRegions.find(r => r.value === selectedRegion)?.label}
            </Typography>
            
            {getCurrentRecommendations() ? (
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Season</strong></TableCell>
                      <TableCell><strong>Planting Period</strong></TableCell>
                      <TableCell><strong>Harvest Period</strong></TableCell>
                      <TableCell><strong>Notes</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getCurrentRecommendations().map((season, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Chip 
                            label={season.season} 
                            color={getSeasonColor(season.season)}
                            icon={season.season.includes('Wet') ? <Cloud /> : <WbSunny />}
                          />
                        </TableCell>
                        <TableCell>{season.months}</TableCell>
                        <TableCell>{season.harvest}</TableCell>
                        <TableCell>{season.notes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Alert severity="info">
                No specific planting data available for {selectedCrop} in {selectedRegion}. 
                Please consult local agricultural extension services.
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {!selectedRegion || !selectedCrop ? (
        <Alert severity="info" sx={{ mb: 4 }}>
          Please select both a region and crop to view planting recommendations.
        </Alert>
      ) : null}

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            General Planting Tips for Nigeria
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Wet Season (April - October):</strong>
              </Typography>
              <Typography variant="body2" paragraph>
                • Best time for most crops<br/>
                • Ensure good drainage<br/>
                • Monitor for fungal diseases<br/>
                • Practice crop rotation
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Dry Season (November - March):</strong>
              </Typography>
              <Typography variant="body2" paragraph>
                • Irrigation required<br/>
                • Ideal for vegetables<br/>
                • Less pest pressure<br/>
                • Fadama farming opportunities
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default PlantingCalendar;
