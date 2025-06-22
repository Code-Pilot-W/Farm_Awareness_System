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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip
} from '@mui/material';
import { Science, Calculate, Agriculture } from '@mui/icons-material';

const FertilizerCalculator = () => {
  const [formData, setFormData] = useState({
    crop: '',
    farmSize: '',
    soilType: '',
    soilPH: '',
    organicMatter: '',
    previousCrop: '',
    targetYield: '',
    region: ''
  });

  const [fertilizerRecommendation, setFertilizerRecommendation] = useState(null);

  const crops = [
    'Maize', 'Rice', 'Cassava', 'Yam', 'Sweet Potato', 'Cowpea', 
    'Groundnut', 'Soybean', 'Millet', 'Sorghum', 'Tomato', 'Pepper'
  ];

  const regions = [
    { value: 'north', label: 'Northern Nigeria' },
    { value: 'middle-belt', label: 'Middle Belt' },
    { value: 'south', label: 'Southern Nigeria' }
  ];

  const soilTypes = [
    'Sandy', 'Clay', 'Loamy', 'Sandy-loam', 'Clay-loam', 'Laterite'
  ];

  const previousCrops = [
    'None/Fallow', 'Legumes (Cowpea, Groundnut)', 'Cereals (Maize, Rice)', 
    'Root crops (Cassava, Yam)', 'Vegetables'
  ];

  // NPK requirements per ton of expected yield (kg/ha)
  const cropNutrientRequirements = {
    'Maize': { N: 25, P: 10, K: 20 },
    'Rice': { N: 20, P: 8, K: 15 },
    'Cassava': { N: 5, P: 3, K: 8 },
    'Yam': { N: 8, P: 4, K: 12 },
    'Sweet Potato': { N: 6, P: 3, K: 10 },
    'Cowpea': { N: 5, P: 8, K: 12 }, // Lower N due to nitrogen fixation
    'Groundnut': { N: 8, P: 10, K: 15 },
    'Soybean': { N: 6, P: 12, K: 18 },
    'Millet': { N: 15, P: 6, K: 12 },
    'Sorghum': { N: 18, P: 7, K: 15 },
    'Tomato': { N: 35, P: 15, K: 40 },
    'Pepper': { N: 30, P: 12, K: 35 }
  };

  // Common Nigerian fertilizer types and their compositions
  const fertilizerTypes = {
    'NPK 15-15-15': { N: 15, P: 15, K: 15, price: 18000 }, // Price per 50kg bag in Naira
    'NPK 20-10-10': { N: 20, P: 10, K: 10, price: 19000 },
    'NPK 12-12-17': { N: 12, P: 12, K: 17, price: 17500 },
    'Urea (46-0-0)': { N: 46, P: 0, K: 0, price: 16000 },
    'SSP (0-18-0)': { N: 0, P: 18, K: 0, price: 12000 },
    'Muriate of Potash (0-0-60)': { N: 0, P: 0, K: 60, price: 22000 }
  };

  const calculateFertilizer = () => {
    const targetYield = parseFloat(formData.targetYield);
    const farmSize = parseFloat(formData.farmSize);
    const cropRequirements = cropNutrientRequirements[formData.crop];

    if (!cropRequirements) return;

    // Calculate base nutrient requirements
    let nRequirement = cropRequirements.N * targetYield;
    let pRequirement = cropRequirements.P * targetYield;
    let kRequirement = cropRequirements.K * targetYield;

    // Adjust based on soil type
    const soilAdjustments = {
      'Sandy': { N: 1.2, P: 1.1, K: 1.3 }, // Sandy soils need more nutrients
      'Clay': { N: 0.9, P: 1.2, K: 0.8 },
      'Loamy': { N: 1.0, P: 1.0, K: 1.0 },
      'Sandy-loam': { N: 1.1, P: 1.0, K: 1.1 },
      'Clay-loam': { N: 0.95, P: 1.1, K: 0.9 },
      'Laterite': { N: 1.1, P: 1.3, K: 1.2 }
    };

    const soilFactor = soilAdjustments[formData.soilType] || { N: 1.0, P: 1.0, K: 1.0 };
    nRequirement *= soilFactor.N;
    pRequirement *= soilFactor.P;
    kRequirement *= soilFactor.K;

    // Adjust based on previous crop
    const previousCropAdjustments = {
      'None/Fallow': { N: 1.0, P: 1.0, K: 1.0 },
      'Legumes (Cowpea, Groundnut)': { N: 0.7, P: 0.9, K: 1.0 }, // Legumes fix nitrogen
      'Cereals (Maize, Rice)': { N: 1.1, P: 1.0, K: 1.1 },
      'Root crops (Cassava, Yam)': { N: 1.0, P: 1.0, K: 1.2 },
      'Vegetables': { N: 0.9, P: 0.9, K: 1.0 }
    };

    const prevCropFactor = previousCropAdjustments[formData.previousCrop] || { N: 1.0, P: 1.0, K: 1.0 };
    nRequirement *= prevCropFactor.N;
    pRequirement *= prevCropFactor.P;
    kRequirement *= prevCropFactor.K;

    // Adjust based on soil pH
    const pH = parseFloat(formData.soilPH);
    if (pH < 5.5) {
      pRequirement *= 1.3; // Acidic soils need more phosphorus
    } else if (pH > 7.5) {
      pRequirement *= 1.2; // Alkaline soils may have P fixation
    }

    // Calculate fertilizer recommendations
    const recommendations = [];

    // Option 1: Single NPK fertilizer
    const npk151515 = fertilizerTypes['NPK 15-15-15'];
    const npkBagsNeeded = Math.ceil(Math.max(
      nRequirement / (npk151515.N * 0.5), // 0.5 = 50kg per bag converted to tons
      pRequirement / (npk151515.P * 0.5),
      kRequirement / (npk151515.K * 0.5)
    ));

    recommendations.push({
      type: 'Single NPK Fertilizer',
      fertilizers: [
        {
          name: 'NPK 15-15-15',
          bags: npkBagsNeeded,
          kgPerHa: (npkBagsNeeded * 50) / farmSize,
          cost: npkBagsNeeded * npk151515.price,
          application: 'Apply at planting and 4-6 weeks after planting'
        }
      ],
      totalCost: npkBagsNeeded * npk151515.price
    });

    // Option 2: Split application with Urea
    const urea = fertilizerTypes['Urea (46-0-0)'];
    const npk201010 = fertilizerTypes['NPK 20-10-10'];
    
    const npkBags = Math.ceil(Math.max(
      pRequirement / (npk201010.P * 0.5),
      kRequirement / (npk201010.K * 0.5)
    ));
    
    const nFromNPK = npkBags * npk201010.N * 0.5;
    const additionalN = Math.max(0, nRequirement - nFromNPK);
    const ureaBags = Math.ceil(additionalN / (urea.N * 0.5));

    recommendations.push({
      type: 'Split Application',
      fertilizers: [
        {
          name: 'NPK 20-10-10',
          bags: npkBags,
          kgPerHa: (npkBags * 50) / farmSize,
          cost: npkBags * npk201010.price,
          application: 'Apply at planting'
        },
        {
          name: 'Urea (46-0-0)',
          bags: ureaBags,
          kgPerHa: (ureaBags * 50) / farmSize,
          cost: ureaBags * urea.price,
          application: 'Apply 4-6 weeks after planting'
        }
      ],
      totalCost: (npkBags * npk201010.price) + (ureaBags * urea.price)
    });

    setFertilizerRecommendation({
      crop: formData.crop,
      farmSize: farmSize,
      targetYield: targetYield,
      nutrientRequirements: {
        N: Math.round(nRequirement),
        P: Math.round(pRequirement),
        K: Math.round(kRequirement)
      },
      recommendations: recommendations,
      additionalTips: generateTips()
    });
  };

  const generateTips = () => {
    const tips = [
      'Apply fertilizers when soil moisture is adequate',
      'Split nitrogen applications to reduce losses',
      'Incorporate organic matter to improve nutrient retention',
      'Test your soil every 2-3 years for accurate recommendations'
    ];

    // Add crop-specific tips
    if (formData.crop === 'Maize') {
      tips.push('Side-dress with nitrogen at knee-high stage');
        } else if (formData.crop === 'Rice') {
      tips.push('Apply urea in split doses: 1/3 at transplanting, 1/3 at tillering, 1/3 at panicle initiation');
    } else if (formData.crop === 'Cassava') {
      tips.push('Apply fertilizer within 2 months of planting for best results');
    } else if (['Cowpea', 'Groundnut', 'Soybean'].includes(formData.crop)) {
      tips.push('Inoculate seeds with rhizobia bacteria to enhance nitrogen fixation');
    }

    // Add soil-specific tips
    if (formData.soilType === 'Sandy') {
      tips.push('Apply fertilizers in smaller, frequent doses to prevent leaching');
    } else if (formData.soilType === 'Clay') {
      tips.push('Ensure good drainage before fertilizer application');
    }

    // Add pH-specific tips
    const pH = parseFloat(formData.soilPH);
    if (pH < 5.5) {
      tips.push('Consider liming to improve soil pH and nutrient availability');
    } else if (pH > 7.5) {
      tips.push('Use acidifying fertilizers or organic matter to lower pH');
    }

    return tips;
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
        <Science sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
        <Typography variant="h4" gutterBottom>
          Nigerian Fertilizer Calculator
        </Typography>
      </Box>
      
      <Typography variant="h6" color="textSecondary" paragraph>
        Calculate optimal fertilizer requirements for your crops based on Nigerian soil conditions
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Farm Information
              </Typography>
              
              <Grid container spacing={2}>
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
                  <TextField
                    fullWidth
                    label="Target Yield (tons/ha)"
                    type="number"
                    value={formData.targetYield}
                    onChange={(e) => handleInputChange('targetYield', e.target.value)}
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
                  <TextField
                    fullWidth
                    label="Soil pH"
                    type="number"
                    value={formData.soilPH}
                    onChange={(e) => handleInputChange('soilPH', e.target.value)}
                    inputProps={{ min: 3.0, max: 9.0, step: 0.1 }}
                    helperText="Range: 3.0 - 9.0"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Organic Matter (%)"
                    type="number"
                    value={formData.organicMatter}
                    onChange={(e) => handleInputChange('organicMatter', e.target.value)}
                    inputProps={{ min: 0, max: 10, step: 0.1 }}
                    helperText="Typical range: 1-5%"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Previous Crop</InputLabel>
                    <Select
                      value={formData.previousCrop}
                      label="Previous Crop"
                      onChange={(e) => handleInputChange('previousCrop', e.target.value)}
                    >
                      {previousCrops.map((crop) => (
                        <MenuItem key={crop} value={crop}>
                          {crop}
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
                  onClick={calculateFertilizer}
                  disabled={!isFormValid()}
                  startIcon={<Calculate />}
                  fullWidth
                >
                  Calculate Fertilizer Requirements
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          {fertilizerRecommendation ? (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Fertilizer Recommendations
                </Typography>
                
                <Box mb={2}>
                  <Typography variant="subtitle1">
                    <strong>{fertilizerRecommendation.crop}</strong> - {fertilizerRecommendation.farmSize} hectares
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Target yield: {fertilizerRecommendation.targetYield} tons/ha
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle1" gutterBottom>
                  Nutrient Requirements (kg/ha)
                </Typography>
                <Box display="flex" gap={1} mb={2}>
                  <Chip label={`N: ${fertilizerRecommendation.nutrientRequirements.N} kg`} color="primary" />
                  <Chip label={`P: ${fertilizerRecommendation.nutrientRequirements.P} kg`} color="secondary" />
                  <Chip label={`K: ${fertilizerRecommendation.nutrientRequirements.K} kg`} color="success" />
                </Box>

                {fertilizerRecommendation.recommendations.map((rec, index) => (
                  <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Option {index + 1}: {rec.type}
                      </Typography>
                      
                      <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Fertilizer</TableCell>
                              <TableCell align="right">Bags (50kg)</TableCell>
                              <TableCell align="right">kg/ha</TableCell>
                              <TableCell align="right">Cost (₦)</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {rec.fertilizers.map((fert, fertIndex) => (
                              <TableRow key={fertIndex}>
                                <TableCell>{fert.name}</TableCell>
                                <TableCell align="right">{fert.bags}</TableCell>
                                <TableCell align="right">{Math.round(fert.kgPerHa)}</TableCell>
                                <TableCell align="right">₦{fert.cost.toLocaleString()}</TableCell>
                              </TableRow>
                            ))}
                            <TableRow>
                              <TableCell colSpan={3}><strong>Total Cost</strong></TableCell>
                              <TableCell align="right"><strong>₦{rec.totalCost.toLocaleString()}</strong></TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>

                      <Box mt={2}>
                        <Typography variant="subtitle2" gutterBottom>
                          Application Schedule:
                        </Typography>
                        {rec.fertilizers.map((fert, fertIndex) => (
                          <Typography key={fertIndex} variant="body2" color="textSecondary">
                            • {fert.name}: {fert.application}
                          </Typography>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent>
                <Box textAlign="center" py={4}>
                  <Agriculture sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
                  <Typography variant="h6" color="textSecondary">
                    Fill in the form to get fertilizer recommendations
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {fertilizerRecommendation && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Application Tips & Best Practices
            </Typography>
            <Grid container spacing={2}>
              {fertilizerRecommendation.additionalTips.map((tip, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Typography variant="body2" paragraph>
                    • {tip}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      <Alert severity="info" sx={{ mt: 3 }}>
        <strong>Important Notes:</strong>
        <br />• Prices are approximate and may vary by location and season
        <br />• Conduct soil tests for more accurate recommendations
        <br />• Consider organic fertilizers and compost to improve soil health
        <br />• Consult local agricultural extension officers for region-specific advice
      </Alert>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Common Nigerian Fertilizer Types & Prices
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Fertilizer Type</TableCell>
                  <TableCell align="center">N-P-K Content</TableCell>
                  <TableCell align="right">Price per 50kg Bag (₦)</TableCell>
                  <TableCell>Best Used For</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>NPK 15-15-15</TableCell>
                  <TableCell align="center">15-15-15</TableCell>
                  <TableCell align="right">₦18,000</TableCell>
                  <TableCell>General purpose, balanced nutrition</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>NPK 20-10-10</TableCell>
                  <TableCell align="center">20-10-10</TableCell>
                  <TableCell align="right">₦19,000</TableCell>
                  <TableCell>Cereals, high nitrogen requirement</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>NPK 12-12-17</TableCell>
                  <TableCell align="center">12-12-17</TableCell>
                  <TableCell align="right">₦17,500</TableCell>
                  <TableCell>Root crops, high potassium needs</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Urea</TableCell>
                  <TableCell align="center">46-0-0</TableCell>
                  <TableCell align="right">₦16,000</TableCell>
                  <TableCell>Top dressing, nitrogen boost</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Single Super Phosphate</TableCell>
                  <TableCell align="center">0-18-0</TableCell>
                  <TableCell align="right">₦12,000</TableCell>
                  <TableCell>Phosphorus deficient soils</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Muriate of Potash</TableCell>
                  <TableCell align="center">0-0-60</TableCell>
                  <TableCell align="right">₦22,000</TableCell>
                  <TableCell>Potassium deficient soils</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Container>
  );
};

export default FertilizerCalculator;
