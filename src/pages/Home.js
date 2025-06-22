import React from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Stack
} from '@mui/material';
import {
  Agriculture,
  CloudQueue,
  BugReport,
  CalendarToday,
  QuestionAnswer,
  Newspaper,
  TrendingUp,
  Security,
  Speed
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Home = () => {
  const features = [
    {
      icon: <CloudQueue sx={{ fontSize: 40 }} />,
      title: 'Weather Monitoring',
      description: 'Get real-time weather updates and forecasts for better farming decisions.',
      link: '/weather',
      color: '#2196F3'
    },
    {
      icon: <Agriculture sx={{ fontSize: 40 }} />,
      title: 'Crop Information',
      description: 'Access comprehensive crop guides and cultivation techniques.',
      link: '/crops',
      color: '#4CAF50'
    },
    {
      icon: <BugReport sx={{ fontSize: 40 }} />,
      title: 'Pest Alerts',
      description: 'Stay informed about pest outbreaks and disease warnings in your area.',
      link: '/pest-alerts',
      color: '#FF5722'
    },
    {
      icon: <CalendarToday sx={{ fontSize: 40 }} />,
      title: 'Farming Calendar',
      description: 'Plan your farming activities with our intelligent scheduling system.',
      link: '/calendar',
      color: '#9C27B0'
    },
    {
      icon: <QuestionAnswer sx={{ fontSize: 40 }} />,
      title: 'Expert Support',
      description: 'Get answers from agricultural experts and experienced farmers.',
      link: '/expert-support',
      color: '#FF9800'
    },
    {
      icon: <Newspaper sx={{ fontSize: 40 }} />,
      title: 'News & Updates',
      description: 'Stay updated with the latest agricultural news and government schemes.',
      link: '/news',
      color: '#607D8B'
    }
  ];

  const stats = [
    { icon: <TrendingUp />, value: '25%', label: 'Yield Increase' },
    { icon: <Security />, value: '99.9%', label: 'Data Security' },
    { icon: <Speed />, value: '24/7', label: 'Support Available' }
  ];

  return (
    <Box>
      {/* Hero Section with Background Image */}
      <Box
        sx={{
          minHeight: '100vh',
          background: `
            linear-gradient(
              135deg, 
              rgba(27, 94, 32, 0.85) 0%, 
              rgba(76, 175, 80, 0.75) 50%,
              rgba(139, 195, 74, 0.85) 100%
            ),
            url('https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.1)',
            zIndex: 1
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={7}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Chip 
                  label="🌱 Smart Farming Solution" 
                  sx={{ 
                    mb: 3, 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    backdropFilter: 'blur(10px)',
                    fontSize: '0.9rem',
                    py: 2
                  }} 
                />
                <Typography 
                  variant="h1" 
                  component="h1" 
                  gutterBottom
                  sx={{
                    fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                    fontWeight: 800,
                    lineHeight: 1.1,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                  }}
                >
                  Transform Your
                  <Box component="span" sx={{ 
                    background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'block'
                  }}>
                    Farming Journey
                  </Box>
                </Typography>
                <Typography 
                  variant="h5" 
                  paragraph 
                  sx={{ 
                    mb: 4, 
                    opacity: 0.95,
                    fontSize: { xs: '1.1rem', md: '1.3rem' },
                    maxWidth: '600px'
                  }}
                >
                  Make smarter farming decisions, 
                  increase yields, and build a sustainable agricultural future.
                </Typography>
                
                {/* Stats Row */}
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={3} 
                  sx={{ mb: 4 }}
                >
                  {stats.map((stat, index) => (
                    <Box 
                      key={index}
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        bgcolor: 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(10px)',
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        border: '1px solid rgba(255,255,255,0.2)'
                      }}
                    >
                      {stat.icon}
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1 }}>
                          {stat.value}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.9 }}>
                          {stat.label}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    component={Link}
                    to="/dashboard"
                    sx={{ 
                      bgcolor: 'white', 
                      color: 'primary.main',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.95)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.3)'
                      }
                    }}
                  >
                    Lets Begin
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    component={Link}
                    to="/about"
                    sx={{ 
                      color: 'white', 
                      borderColor: 'rgba(255,255,255,0.5)',
                      backdropFilter: 'blur(10px)',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255,255,255,0.1)'
                      }
                    }}
                  >
                    .....
                  </Button>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom
            sx={{ fontWeight: 700, mb: 2 }}
          >
            Powerful Features for Modern Farmers
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ maxWidth: '600px', mx: 'auto' }}
          >
            Everything you need to optimize your farming operations and maximize productivity
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    '& .feature-icon': {
                      transform: 'scale(1.1) rotate(5deg)',
                    }
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 4 }}>
                  <Avatar
                    className="feature-icon"
                    sx={{
                      bgcolor: feature.color,
                      width: 64,
                      height: 64,
                      mb: 3,
                      transition: 'all 0.3s ease-in-out'
                    }}
                  >
                    {feature.icon}
                  </Avatar>
                  
                  <Typography 
                    variant="h5" 
                    component="h3" 
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    {feature.title}
                  </Typography>
                  
                  <Typography 
                    variant="body1" 
                    color="text.secondary" 
                    paragraph
                    sx={{ mb: 3 }}
                  >
                    {feature.description}
                  </Typography>
                  
                  <Button
                    variant="text"
                    component={Link}
                    to={feature.link}
                    sx={{ 
                      color: feature.color,
                      fontWeight: 600,
                      '&:hover': {
                        bgcolor: `${feature.color}15`
                      }
                    }}
                  >
                    Explore Feature →
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
          py: 10,
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
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            opacity: 0.3
          }}
        />
        
        <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom
            sx={{ color: 'white', fontWeight: 700, mb: 2 }}
          >
            Ready to Revolutionize Your Farm?
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ color: 'rgba(255,255,255,0.9)', mb: 4, maxWidth: '500px', mx: 'auto' }}
          >
            Join over 10,000+ farmers who have increased their productivity with FarmAssist
          </Typography>
          
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/register"
              sx={{ 
                bgcolor: 'white',
                color: 'primary.main',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.95)'
                }
              }}
            >
              Get Started Free
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{ 
                color: 'white',
                borderColor: 'rgba(255,255,255,0.5)',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Contact Sales
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
