import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  TextField,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { Search, ExpandMore, Agriculture } from '@mui/icons-material';

const CropInfo = () => {
  const [crops, setCrops] = useState([]);
  const [filteredCrops, setFilteredCrops] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('all');

  useEffect(() => {
    fetchCropData();
  }, []);

  useEffect(() => {
    filterCrops();
  }, [searchTerm, selectedSeason, crops]);

  const fetchCropData = async () => {
    try {
      const response = await fetch('/api/crops');
      const data = await response.json();
      setCrops(data);
      setFilteredCrops(data);
    } catch (error) {
      console.error('Error fetching crop data:', error);
      // Mock data for Nigerian crops
      const mockCrops = [
        {
          id: 1,
          name: 'Rice',
          season: 'Wet Season',
          plantingTime: 'May-July',
          harvestTime: 'September-November',
          soilType: 'Clay, Loamy, Swampy',
          waterRequirement: 'High',
          image: '/images/rice.jpg',
          tips: [
            'Plant during early rains for optimal yield',
            'Maintain water level of 5-10cm in paddy fields',
            'Apply NPK fertilizer at transplanting',
            'Weed regularly during first 6 weeks'
          ],
          diseases: ['Rice Blast', 'Brown Spot', 'Bacterial Leaf Blight', 'Sheath Blight']
        },
        {
          id: 2,
          name: 'Maize (Corn)',
          season: 'Wet Season',
          plantingTime: 'April-July',
          harvestTime: 'August-December',
          soilType: 'Well-drained, Fertile Loam',
          waterRequirement: 'Medium',
          image: '/images/maize.jpg',
          tips: [
            'Plant 2-3 seeds per hole at 3-4cm depth',
            'Space plants 25-30cm apart in rows',
            'Apply organic manure before planting',
            'Side-dress with nitrogen fertilizer at 4-6 weeks'
          ],
          diseases: ['Maize Streak Virus', 'Downy Mildew', 'Leaf Blight', 'Stalk Rot']
        },
        {
          id: 3,
          name: 'Cassava',
          season: 'All Year',
          plantingTime: 'March-July',
          harvestTime: '8-18 months after planting',
          soilType: 'Sandy, Well-drained',
          waterRequirement: 'Low',
          image: '/images/cassava.jpg',
          tips: [
            'Use healthy stem cuttings 20-25cm long',
            'Plant at 45-degree angle in ridges',
            'Weed regularly in first 3 months',
            'Harvest when leaves turn yellow'
          ],
          diseases: ['Cassava Mosaic Disease', 'Cassava Bacterial Blight', 'Root Rot']
        },
        {
          id: 4,
          name: 'Yam',
          season: 'Wet Season',
          plantingTime: 'April-June',
          harvestTime: 'December-February',
          soilType: 'Deep, Well-drained Loam',
          waterRequirement: 'Medium',
          image: '/images/yam.jpg',
          tips: [
            'Use seed yams of 200-500g weight',
            'Plant on ridges or mounds 1m apart',
            'Provide stakes for climbing support',
            'Mulch around plants to retain moisture'
          ],
          diseases: ['Yam Mosaic Virus', 'Anthracnose', 'Dry Rot', 'Nematodes']
        },
        {
          id: 5,
          name: 'Cocoa',
          season: 'All Year',
          plantingTime: 'May-July',
          harvestTime: '3-5 years after planting',
          soilType: 'Rich, Well-drained Forest Soil',
          waterRequirement: 'High',
          image: '/images/cocoa.jpg',
          tips: [
            'Provide shade during early growth',
            'Plant during rainy season for establishment',
            'Prune regularly to maintain shape',
            'Apply organic fertilizer annually'
          ],
          diseases: ['Black Pod Disease', 'Swollen Shoot Virus', 'Witches Broom', 'Frosty Pod Rot']
        },
        {
          id: 6,
          name: 'Plantain',
          season: 'All Year',
          plantingTime: 'March-July',
          harvestTime: '12-15 months after planting',
          soilType: 'Rich, Well-drained Loam',
          waterRequirement: 'High',
          image: '/images/plantain.jpg',
          tips: [
            'Use healthy suckers for planting',
            'Plant in holes 30cm deep and wide',
            'Mulch heavily around plants',
            'Remove excess suckers regularly'
          ],
          diseases: ['Black Sigatoka', 'Panama Disease', 'Banana Bunchy Top Virus']
        },
        {
          id: 7,
          name: 'Cowpea (Black-eyed Peas)',
          season: 'Dry Season',
          plantingTime: 'October-February',
          harvestTime: '60-90 days after planting',
          soilType: 'Sandy Loam, Well-drained',
          waterRequirement: 'Low',
          image: '/images/cowpea.jpg',
          tips: [
            'Plant 2-3 seeds per hole at 2-3cm depth',
            'Space plants 20-30cm apart',
            'Requires minimal fertilizer due to nitrogen fixation',
            'Harvest pods when they turn brown'
          ],
          diseases: ['Cowpea Mosaic Virus', 'Bacterial Blight', 'Anthracnose', 'Root Rot']
        },
        {
          id: 8,
          name: 'Millet',
          season: 'Wet Season',
          plantingTime: 'May-July',
          harvestTime: 'September-November',
          soilType: 'Sandy, Drought-tolerant',
          waterRequirement: 'Low',
          image: '/images/millet.jpg',
          tips: [
            'Broadcast seeds or plant in rows',
            'Thin seedlings to proper spacing',
            'Very drought tolerant once established',
            'Harvest when grains are hard and dry'
          ],
          diseases: ['Downy Mildew', 'Smut', 'Ergot', 'Leaf Spot']
        }
      ];
      setCrops(mockCrops);
      setFilteredCrops(mockCrops);
    }
  };

  const filterCrops = () => {
    let filtered = crops;
    
    if (searchTerm) {
      filtered = filtered.filter(crop =>
        crop.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedSeason !== 'all') {
      filtered = filtered.filter(crop =>
        crop.season.toLowerCase() === selectedSeason.toLowerCase()
      );
    }
    
    setFilteredCrops(filtered);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Nigerian Crop Information & Guidelines
      </Typography>
      
      {/* Search and Filter */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search Nigerian crops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box>
              <Chip
                label="All Seasons"
                onClick={() => setSelectedSeason('all')}
                color={selectedSeason === 'all' ? 'primary' : 'default'}
                sx={{ mr: 1, mb: 1 }}
              />
              <Chip
                label="Wet Season"
                onClick={() => setSelectedSeason('wet season')}
                color={selectedSeason === 'wet season' ? 'primary' : 'default'}
                sx={{ mr: 1, mb: 1 }}
              />
              <Chip
                label="Dry Season"
                onClick={() => setSelectedSeason('dry season')}
                color={selectedSeason === 'dry season' ? 'primary' : 'default'}
                sx={{ mr: 1, mb: 1 }}
              />
              <Chip
                label="All Year"
                onClick={() => setSelectedSeason('all year')}
                color={selectedSeason === 'all year' ? 'primary' : 'default'}
                sx={{ mr: 1, mb: 1 }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Crop Cards */}
      <Grid container spacing={3}>
        {filteredCrops.map((crop) => (
          <Grid item xs={12} md={6} lg={4} key={crop.id}>
            <Card sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                height="200"
                image={crop.image}
                alt={crop.name}
                onError={(e) => {
                  e.target.src = '/images/default-crop.jpg';
                }}
              />
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {crop.name}
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={crop.season}
                    color="primary"
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={crop.waterRequirement + ' Water'}
                    color="secondary"
                    size="small"
                  />
                </Box>
                
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  <strong>Planting:</strong> {crop.plantingTime}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  <strong>Harvest:</strong> {crop.harvestTime}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  <strong>Soil:</strong> {crop.soilType}
                </Typography>

                {/* Expandable sections */}
                <Accordion sx={{ mt: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="subtitle2">Growing Tips</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {crop.tips.map((tip, index) => (
                      <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                        • {tip}
                      </Typography>
                    ))}
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="subtitle2">Common Diseases</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {crop.diseases.map((disease, index) => (
                      <Chip
                        key={index}
                        label={disease}
                        size="small"
                        variant="outlined"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </AccordionDetails>
                </Accordion>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CropInfo;
