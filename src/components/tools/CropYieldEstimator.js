import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Alert,
  Divider,
  Chip,
  LinearProgress
} from '@mui/material';
import { TrendingUp, Agriculture, Assessment } from '@mui/icons-material';

const CropYieldEstimator = () => {
  const [formData, setFormData] = useState({
    crop: '',
    region: '',
    farmSize: '',
    soilType: '',
    irrigationType: '',
    fertilizer: '',
    seedVariety: '',
    farmingExperience: ''
  });

  const [yieldEstimate, setYieldEstimate] = useState(null);
  const [loading, setLoading] = useState(false);

  const crops = [
    'Maize', 'Rice', 'Cassava', 'Yam', 'Sweet Potato', 'Cowpea', 
    'Groundnut', 'Soybean', 'Millet', 'Sorghum'
  ];

  const regions = [
    { value: 'north', label: 'Northern Nigeria' },
    { value: 'middle-belt', label: 'Middle Belt' },
    { value: 'south-west', label: 'South West' },
    { value: 'south-east', label: 'South East' },
    { value: 'south-south', label: 'South South' }
  ];

  const soilTypes = [
    'Sandy', 'Clay', 'Loamy', 'Sandy-loam', 'Clay-loam', 'Laterite'
  ];

  const irrigationTypes = [
    'Rain-fed only', 'Drip irrigation', 'Sprinkler', 'Flood irrigation', 'Manual watering'
  ];

  const fertilizerTypes = [
    'No fertilizer', 'Organic only', 'NPK fertilizer', 'Urea', 'Mixed (Organic + Inorganic)'
  ];

  const seedVarieties = [
    'Local variety', 'Improved variety', 'Hybrid', 'Certified seeds'
  ];

  const experienceLevels = [
    'Beginner (0-2 years)', 'Intermediate (3-5 years)', 'Experienced (6-10 years)', 'Expert (10+ years)'
  ];

  // Base yield data (tons per hectare) for Nigerian conditions
  const baseYields = {
    'Maize': { min: 1.5, max: 4.5, average: 2.8 },
    'Rice': { min: 2.0, max: 6.0, average: 3.5 },
    'Cassava': { min: 8.0, max: 25.0, average: 15.0 },
    'Yam': { min: 8.0, max: 20.0, average: 12.0 },
    'Sweet Potato': { min: 5.0, max: 15.0, average: 8.5 },
    'Cowpea': { min: 0.8, max: 2.5, average: 1.4 },
    'Groundnut': { min: 1.0, max: 3.0, average: 1.8 },
    'Soybean': { min: 1.2, max: 3.5, average: 2.0 },
    'Millet': { min: 0.8, max: 2.0, average: 1.2 },
    'Sorghum': { min: 1.0, max: 3.0, average: 1.8 }
  };

  const calculateYield = () => {
    setLoading(true);
    
    setTimeout(() => {
      const baseYield = baseYields[formData.crop];
      if (!baseYield) {
        setLoading(false);
        return;
      }

      let yieldMultiplier = 1.0;
      let factors = [];

      // Region factor
      const regionFactors = {
        'north': formData.crop === 'Millet' || formData.crop === 'Sorghum' ? 1.1 : 0.9,
        'middle-belt': 1.0,
        'south-west': formData.crop === 'Cassava' || formData.crop === 'Yam' ? 1.1 : 1.0,
        'south-east': formData.crop === 'Cassava' || formData.crop === 'Yam' ? 1.15 : 1.0,
        'south-south': formData.crop === 'Cassava' ? 1.1 : 0.95
      };
      
      const regionFactor = regionFactors[formData.region] || 1.0;
      yieldMultiplier *= regionFactor;
      factors.push(`Region: ${regionFactor > 1 ? '+' : ''}${((regionFactor - 1) * 100).toFixed(0)}%`);

      // Soil type factor
      const soilFactors = {
        'Loamy': 1.2,
        'Sandy-loam': 1.1,
        'Clay-loam': 1.05,
        'Sandy': 0.9,
        'Clay': 0.85,
        'Laterite': 0.8
      };
      
      const soilFactor = soilFactors[formData.soilType] || 1.0;
      yieldMultiplier *= soilFactor;
      factors.push(`Soil: ${soilFactor > 1 ? '+' : ''}${((soilFactor - 1) * 100).toFixed(0)}%`);

      // Irrigation factor
      const irrigationFactors = {
        'Rain-fed only': 1.0,
        'Manual watering': 1.1,
        'Flood irrigation': 1.15,
        'Sprinkler': 1.25,
        'Drip irrigation': 1.3
      };
      
      const irrigationFactor = irrigationFactors[formData.irrigationType] || 1.0;
      yieldMultiplier *= irrigationFactor;
      factors.push(`Irrigation: ${irrigationFactor > 1 ? '+' : ''}${((irrigationFactor - 1) * 100).toFixed(0)}%`);

      // Fertilizer factor
      const fertilizerFactors = {
        'No fertilizer': 0.7,
        'Organic only': 0.9,
        'Urea': 1.1,
        'NPK fertilizer': 1.2,
        'Mixed (Organic + Inorganic)': 1.25
      };
      
      const fertilizerFactor = fertilizerFactors[formData.fertilizer] || 1.0;
      yieldMultiplier *= fertilizerFactor;
      factors.push(`Fertilizer: ${fertilizerFactor > 1 ? '+' : ''}${((fertilizerFactor - 1) * 100).toFixed(0)}%`);

      // Seed variety factor
      const seedFactors = {
        'Local variety': 0.8,
        'Improved variety': 1.0,
        'Certified seeds': 1.1,
        'Hybrid': 1.2
      };
      
      const seedFactor = seedFactors[formData.seedVariety] || 1.0;
      yieldMultiplier *= seedFactor;
      factors.push(`Seeds: ${seedFactor > 1 ? '+' : ''}${((seedFactor - 1) * 100).toFixed(0)}%`);

      // Experience factor
      const experienceFactors = {
        'Beginner (0-2 years)': 0.8,
        'Intermediate (3-5 years)': 0.9,
        'Experienced (6-10 years)': 1.0,
        'Expert (10+ years)': 1.1
      };
      
      const experienceFactor = experienceFactors[formData.farmingExperience] || 1.0;
      yieldMultiplier *= experienceFactor;
      factors.push(`Experience: ${experienceFactor > 1 ? '+' : ''}${((experienceFactor - 1) * 100).toFixed(0)}%`);

      const estimatedYieldPerHa = baseYield.average * yieldMultiplier;
      const totalYield = estimatedYieldPerHa * parseFloat(formData.farmSize);
      
      const confidence = Math.min(95, Math.max(60, 80 + (yieldMultiplier - 1) * 20));

      setYieldEstimate({
        yieldPerHectare: estimatedYieldPerHa.toFixed(2),
        totalYield: totalYield.toFixed(2),
        farmSize: formData.farmSize,
        crop: formData.crop,
        factors: factors,
        confidence: confidence.toFixed(0),
        baseYield: baseYield.average,
        multiplier: yieldMultiplier.toFixed(2)
      });
      
      setLoading(false);
    }, 1500);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormValid = () => {
    return Object.values(formData).every(value => value !== '');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <TrendingUp sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
        <Typography variant="h4" gutterBottom>
          Nigerian Crop Yield Estimator
        </Typography>
      </Box>
      
      <Typography variant="h6" color="textSecondary" paragraph>
        Estimate potential crop yields based on your farming conditions in Nigeria
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Farm Details
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Crop Type</InputLabel>
                    <Select
                      value={formData.crop}
                      label="Crop Type"
                      onChange={(e) => handleInputChange('crop', e.target.value)}
                    >
                      {crops.map((crop) => (
                        <MenuItem key={crop} value={crop}>
                          {crop}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Region</InputLabel>
                    <Select
                      value={formData.region}
                      label="Region"
                      onChange={(e) => handleInputChange('region', e.target.value)}
                    >
                      {regions.map((region) => (
                        <MenuItem key={region.value} value={region.value}>
                          {region.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Farm Size (hectares)"
                    type="number"
                    value={formData.farmSize}
                    onChange={(e) => handleInputChange('farmSize', e.target.value)}
                    inputProps={{ min: 0.1, step: 0.1 }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Soil Type</InputLabel>
                    <Select
                      value={formData.soilType}
                      label="Soil Type"
                      onChange={(e) => handleInputChange('soilType', e.target.value)}
                    >
                      {soilTypes.map((soil) => (
                        <MenuItem key={soil} value={soil}>
                          {soil}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Irrigation Type</InputLabel>
                    <Select
                      value={formData.irrigationType}
                      label="Irrigation Type"
                      onChange={(e) => handleInputChange('irrigationType', e.target.value)}
                    >
                      {irrigationTypes.map((irrigation) => (
                        <MenuItem key={irrigation} value={irrigation}>
                          {irrigation}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Fertilizer Type</InputLabel>
                    <Select
                      value={formData.fertilizer}
                      label="Fertilizer Type"
                      onChange={(e) => handleInputChange('fertilizer', e.target.value)}
                    >
                      {fertilizerTypes.map((fertilizer) => (
                        <MenuItem key={fertilizer} value={fertilizer}>
                          {fertilizer}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Seed Variety</InputLabel>
                    <Select
                      value={formData.seedVariety}
                      label="Seed Variety"
                      onChange={(e) => handleInputChange('seedVariety', e.target.value)}
                    >
                      {seedVarieties.map((seed) => (
                        <MenuItem key={seed} value={seed}>
                          {seed}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Farming Experience</InputLabel>
                    <Select
                      value={formData.farmingExperience}
                      label="Farming Experience"
                      onChange={(e) => handleInputChange('farmingExperience', e.target.value)}
                    >
                      {experienceLevels.map((level) => (
                        <MenuItem key={level} value={level}>
                          {level}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Box mt={3}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={calculateYield}
                  disabled={!isFormValid() || loading}
                  startIcon={<Assessment />}
                  fullWidth
                >
                  {loading ? 'Calculating...' : 'Calculate Yield Estimate'}
                </Button>
              </Box>

              {loading && (
                <Box mt={2}>
                  <LinearProgress />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          {yieldEstimate ? (
            <Card>
                            <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Yield Estimate Results
                </Typography>
                
                <Box mb={2}>
                  <Typography variant="h4" color="success.main">
                    {yieldEstimate.totalYield} tons
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total estimated yield
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box mb={2}>
                  <Typography variant="h6">
                    {yieldEstimate.yieldPerHectare} tons/ha
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Yield per hectare
                  </Typography>
                </Box>

                <Box mb={2}>
                  <Typography variant="body1">
                    <strong>Farm Size:</strong> {yieldEstimate.farmSize} hectares
                  </Typography>
                  <Typography variant="body1">
                    <strong>Crop:</strong> {yieldEstimate.crop}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box mb={2}>
                  <Typography variant="subtitle1" gutterBottom>
                    Confidence Level
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={parseInt(yieldEstimate.confidence)} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    {yieldEstimate.confidence}% confidence
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle1" gutterBottom>
                  Yield Factors
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {yieldEstimate.factors.map((factor, index) => (
                    <Chip 
                      key={index} 
                      label={factor} 
                      size="small" 
                      color={factor.includes('+') ? 'success' : factor.includes('-') ? 'error' : 'default'}
                    />
                  ))}
                </Box>

                <Box mt={2}>
                  <Typography variant="body2" color="textSecondary">
                    Base yield: {baseYields[formData.crop]?.average} tons/ha<br/>
                    Adjustment factor: {yieldEstimate.multiplier}x
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent>
                <Box textAlign="center" py={4}>
                  <Agriculture sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
                  <Typography variant="h6" color="textSecondary">
                    Fill in the form to get your yield estimate
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          )}

          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tips for Better Yields
              </Typography>
              <Typography variant="body2" paragraph>
                • Use certified seeds for better germination
              </Typography>
              <Typography variant="body2" paragraph>
                • Apply fertilizers based on soil test results
              </Typography>
              <Typography variant="body2" paragraph>
                • Implement proper irrigation scheduling
              </Typography>
              <Typography variant="body2" paragraph>
                • Practice integrated pest management
              </Typography>
              <Typography variant="body2">
                • Follow recommended planting densities
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Alert severity="info" sx={{ mt: 3 }}>
        <strong>Disclaimer:</strong> This is an estimate based on average conditions and factors. 
        Actual yields may vary due to weather, pests, diseases, and other unforeseen circumstances. 
        Consult with local agricultural extension services for more precise recommendations.
      </Alert>
    </Container>
  );
};

export default CropYieldEstimator;

