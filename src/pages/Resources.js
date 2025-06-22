import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip
} from '@mui/material';
import {
  MenuBook,
  VideoLibrary,
  Download,
  Link as LinkIcon,
  Agriculture,
  Science,
  TrendingUp
} from '@mui/icons-material';

const Resources = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const guides = [
    {
      id: 1,
      title: 'Complete Cassava Cultivation Guide for Nigeria',
      description: 'Comprehensive guide covering cassava farming from planting to processing in Nigerian conditions.',
      category: 'Root Crops',
      downloadUrl: '/downloads/cassava-guide-nigeria.pdf',
      image: '/images/resources/cassava-guide.jpg'
    },
    {
      id: 2,
      title: 'Rice Production in Nigerian Wetlands',
      description: 'Learn rice cultivation techniques suitable for Nigerian wetland conditions.',
      category: 'Cereals',
      downloadUrl: '/downloads/rice-nigeria-guide.pdf',
      image: '/images/resources/rice-nigeria-guide.jpg'
    },
    {
      id: 3,
      title: 'Yam Farming Best Practices',
      description: 'Traditional and modern yam farming techniques for maximum yield in Nigeria.',
      category: 'Root Crops',
      downloadUrl: '/downloads/yam-farming-guide.pdf',
      image: '/images/resources/yam-guide.jpg'
    },
    {
      id: 4,
      title: 'Maize Production Guide',
      description: 'Complete guide to maize cultivation in different Nigerian ecological zones.',
      category: 'Cereals',
      downloadUrl: '/downloads/maize-guide-nigeria.pdf',
      image: '/images/resources/maize-guide.jpg'
    },
    {
      id: 5,
      title: 'Cocoa Farming in Southwest Nigeria',
      description: 'Sustainable cocoa production techniques and disease management.',
      category: 'Cash Crops',
      downloadUrl: '/downloads/cocoa-farming-guide.pdf',
      image: '/images/resources/cocoa-guide.jpg'
    },
    {
      id: 6,
      title: 'Palm Oil Production Manual',
      description: 'From plantation to processing - complete palm oil production guide.',
      category: 'Cash Crops',
      downloadUrl: '/downloads/palm-oil-guide.pdf',
      image: '/images/resources/palm-oil-guide.jpg'
    }
  ];

  const videos = [
    {
      id: 1,
      title: 'Modern Cassava Processing Techniques',
      description: 'Learn efficient cassava processing methods for garri and flour production.',
      duration: '18:45',
      thumbnail: '/images/resources/cassava-processing-video.jpg',
      url: 'https://www.youtube.com/watch?v=_IjW076vOBg'
    },
    {
      id: 2,
      title: 'Irrigation Systems for Dry Season Farming',
      description: 'Water management techniques for year-round farming in Nigeria.',
      duration: '22:30',
      thumbnail: '/images/resources/irrigation-nigeria-video.jpg',
      url: 'https://www.youtube.com/watch?v=Blb0_8ZcMwc&pp=ygUPI25pbWFybmRlc29mYXJt'
    },
    {
      id: 3,
      title: 'Integrated Pest Management for Nigerian Crops',
      description: 'Effective pest control strategies for common Nigerian agricultural pests.',
      duration: '16:15',
      thumbnail: '/images/resources/pest-control-nigeria-video.jpg',
      url: 'https://www.youtube.com/watch?v=yD6hELiVMNM'
    },
    {
      id: 4,
      title: 'Soil Fertility Management in the Tropics',
      description: 'Maintaining soil health in Nigerian tropical conditions.',
      duration: '20:10',
      thumbnail: '/images/resources/soil-fertility-video.jpg',
      url: 'https://www.youtube.com/watch?app=desktop&v=9bZXBxtpq3E&t=460s'
    }
  ];

  const tools = [
    {
      name: 'Nigerian Fertilizer Calculator',
      description: 'Calculate optimal fertilizer requirements for Nigerian crops and soil conditions.',
      icon: <Science />,
      url: '/tools/fertilizer-calculator'
    },
    {
      name: 'Crop Yield Estimator',
      description: 'Estimate potential yield for Nigerian crops based on local factors.',
      icon: <TrendingUp />,
      url: '/tools/yield-estimator'
    },
    {
      name: 'Nigerian Planting Calendar',
      description: 'Find optimal planting times based on Nigerian seasons and regions.',
      icon: <Agriculture />,
      url: '/tools/planting-calendar'
    }
  ];

  const links = [
    {
      title: 'Federal Ministry of Agriculture and Rural Development',
      url: 'https://fmard.gov.ng/',
      description: 'Official Nigerian government portal for agricultural policies and programs.'
    },
    {
      title: 'Nigerian Agricultural Insurance Corporation (NAIC)',
      url: 'https://naic.gov.ng/',
      description: 'Agricultural insurance services and crop protection schemes.'
    },
    {
      title: 'International Institute of Tropical Agriculture (IITA)',
      url: 'https://www.iita.org/',
      description: 'Research and development for tropical agriculture in Nigeria.'
    },
    {
      title: 'Nigerian Agricultural Development Programs',
      url: 'https://fadama.net/',
      description: 'Fadama and other agricultural development initiatives.'
    },
    {
      title: 'Central Bank of Nigeria - Agricultural Credit',
      url: 'https://www.cbn.gov.ng/devfin/acgsf.asp',
      description: 'Agricultural credit guarantee scheme and financing options.'
    },
    {
      title: 'Nigerian Meteorological Agency (NIMET)',
      url: 'https://nimet.gov.ng/',
      description: 'Weather forecasts and climate information for farming decisions.'
    }
  ];

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Nigerian Farming Resources
      </Typography>
      <Typography variant="h6" color="textSecondary" paragraph>
        Access guides, videos, tools, and useful links tailored for Nigerian agriculture
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={selectedTab} onChange={handleTabChange}>
          <Tab label="Farming Guides" icon={<MenuBook />} />
          <Tab label="Video Tutorials" icon={<VideoLibrary />} />
          <Tab label="Farming Tools" icon={<Agriculture />} />
          <Tab label="Useful Links" icon={<LinkIcon />} />
        </Tabs>
      </Box>

      {/* Guides Tab */}
      <TabPanel value={selectedTab} index={0}>
        <Grid container spacing={3}>
          {guides.map((guide) => (
            <Grid item xs={12} md={4} key={guide.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={guide.image}
                  alt={guide.title}
                  onError={(e) => {
                    e.target.src = '/images/default-resource.jpg';
                  }}
                />
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Chip label={guide.category} color="primary" size="small" />
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {guide.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph sx={{ flexGrow: 1 }}>
                    {guide.description}
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Download />}
                    href={guide.downloadUrl}
                    download
                    fullWidth
                    sx={{ mt: 'auto' }}
                  >
                    Download Guide
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Videos Tab */}
      <TabPanel value={selectedTab} index={1}>
        <Grid container spacing={3}>
          {videos.map((video) => (
            <Grid item xs={12} md={6} key={video.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={video.thumbnail}
                  alt={video.title}
                  onError={(e) => {
                    e.target.src = '/images/default-video.jpg';
                  }}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {video.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    {video.description}
                  </Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Chip label={video.duration} size="small" />
                    <Button
                      variant="contained"
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Watch Video
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Tools Tab */}
      <TabPanel value={selectedTab} index={2}>
        <Grid container spacing={3}>
          {tools.map((tool, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>
                    {React.cloneElement(tool.icon, { sx: { fontSize: 48 } })}
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {tool.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    {tool.description}
                  </Typography>
                  <Button
                    variant="outlined"
                    href={tool.url}
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    Use Tool
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Links Tab */}
      <TabPanel value={selectedTab} index={3}>
        <List>
          {links.map((link, index) => (
            <ListItem
              key={index}
              sx={{
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                mb: 2,
                '&:hover': {
                  bgcolor: 'action.hover'
                }
              }}
            >
              <ListItemIcon>
                <LinkIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="h6">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      {link.title}
                    </a>
                  </Typography>
                }
                secondary={link.description}
              />
            </ListItem>
          ))}
        </List>
      </TabPanel>
    </Container>
  );
};

export default Resources;
