import React, { useState, forwardRef } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Avatar,
  Badge,
  Chip,
  Divider,
  ListItemIcon,
  ListItemText,
  Tooltip,
  useScrollTrigger,
  Slide,
  Container
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Notifications,
  Dashboard,
  CloudQueue,
  Agriculture,
  Article,
  LibraryBooks,
  Person,
  Settings,
  Logout,
  Home,
  WbSunny,
  TrendingUp
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Fixed HideOnScroll component
function HideOnScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationOpen = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    handleClose();
  };

  // Check if current route is active
  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  // Navigation items with icons
  const navItems = [
    { label: 'Home', path: '/', icon: <Home sx={{ fontSize: 18 }} /> },
    { label: 'Dashboard', path: '/dashboard', icon: <Dashboard sx={{ fontSize: 18 }} /> },
    { label: 'Weather', path: '/weather', icon: <CloudQueue sx={{ fontSize: 18 }} /> },
    { label: 'Crops', path: '/crops', icon: <Agriculture sx={{ fontSize: 18 }} /> },
    { label: 'News', path: '/news', icon: <Article sx={{ fontSize: 18 }} /> },
    { label: 'Resources', path: '/resources', icon: <LibraryBooks sx={{ fontSize: 18 }} /> }
  ];

  // Mock notifications
  const notifications = [
    { id: 1, message: 'Pest alert in tomato field', time: '5 min ago', type: 'alert' },
    { id: 2, message: 'Rain expected tomorrow', time: '1 hour ago', type: 'weather' },
    { id: 3, message: 'Expert replied to your question', time: '2 hours ago', type: 'expert' }
  ];

  return (
    <>
      <HideOnScroll>
        <AppBar 
          position="fixed"
          sx={{
            background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #388e3c 100%)',
            boxShadow: '0 4px 20px rgba(27, 94, 32, 0.3)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            // Add keyframes for pulse animation
            '@keyframes pulse': {
              '0%': { transform: 'scale(1)' },
              '50%': { transform: 'scale(1.1)' },
              '100%': { transform: 'scale(1)' }
            }
          }}
        >
          <Container maxWidth="xl">
            <Toolbar sx={{ minHeight: { xs: 64, sm: 70 }, px: { xs: 1, sm: 2 } }}>
              {/* Logo and Brand */}
              <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                <Avatar
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                    mr: 2,
                    width: 40,
                    height: 40,
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'rotate(360deg)',
                      bgcolor: 'rgba(255, 255, 255, 0.25)'
                    }
                  }}
                >
                  <Agriculture sx={{ color: 'white' }} />
                </Avatar>
                <Box>
                  <Typography 
                    variant="h5"
                    component={Link}
                    to="/"
                    sx={{
                      fontWeight: 800,
                      letterSpacing: '-0.5px',
                      background: 'linear-gradient(45deg, #ffffff, #e8f5e8)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      lineHeight: 1.2,
                      textDecoration: 'none',
                      '&:hover': {
                        transform: 'scale(1.02)',
                        transition: 'transform 0.2s ease-in-out'
                      }
                    }}
                  >
                    FarmAssist
                  </Typography>
                  <Typography 
                    variant="caption"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.7rem',
                      fontWeight: 500,
                      display: { xs: 'none', sm: 'block' }
                    }}
                  >
                    Smart Farming Solutions
                  </Typography>
                </Box>
              </Box>

              {/* Navigation Items - Desktop */}
              <Box sx={{ 
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                gap: 1,
                mr: 2 
              }}>
                {navItems.map((item) => (
                  <Button
                    key={item.path}
                    color="inherit"
                    component={Link}
                    to={item.path}
                    startIcon={item.icon}
                    sx={{
                      fontWeight: 600,
                      borderRadius: 2,
                      px: 2,
                      py: 1,
                      textTransform: 'none',
                      position: 'relative',
                      backgroundColor: isActiveRoute(item.path)
                        ? 'rgba(255, 255, 255, 0.15)'
                        : 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                      },
                      '&::after': isActiveRoute(item.path) ? {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '60%',
                        height: 2,
                        backgroundColor: 'white',
                        borderRadius: 1
                      } : {},
                      transition: 'all 0.2s ease-in-out'
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>

              {/* Weather Quick Info */}
              <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', mr: 2 }}>
                <Chip
                  icon={<WbSunny sx={{ color: '#ffc107 !important' }} />}
                  label="28°C Lagos"
                  size="small"
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                    color: 'white',
                    fontWeight: 500,
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.25)',
                      transform: 'scale(1.05)'
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                />
              </Box>

              {/* User Actions */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {user ? (
                  <>
                    {/* Notifications */}
                    <Tooltip title="Notifications">
                      <IconButton
                        color="inherit"
                        onClick={handleNotificationOpen}
                        aria-label="notifications"
                        sx={{
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            transform: 'scale(1.05)'
                          },
                          transition: 'all 0.2s ease-in-out'
                        }}
                      >
                        <Badge
                          badgeContent={notifications.length}
                          color="error"
                          sx={{
                            '& .MuiBadge-badge': {
                              animation: notifications.length > 0 ? 'pulse 2s infinite' : 'none'
                            }
                          }}
                        >
                          <Notifications />
                        </Badge>
                      </IconButton>
                    </Tooltip>

                    {/* User Profile */}
                    <Tooltip title="Account">
                      <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                        sx={{
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            transform: 'scale(1.05)'
                          },
                          transition: 'all 0.2s ease-in-out'
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 36,
                            height: 36,
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                            fontWeight: 600,
                            border: '2px solid rgba(255, 255, 255, 0.3)'
                          }}
                        >
                          {user.name?.charAt(0) || 'U'}
                        </Avatar>
                      </IconButton>
                    </Tooltip>
                  </>
                ) : (
                  <>
                    <Button
                      color="inherit"
                      component={Link}
                      to="/login"
                      sx={{
                        fontWeight: 600,
                        borderRadius: 2,
                        px: 3,
                        textTransform: 'none',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          transform: 'translateY(-1px)'
                        },
                        transition: 'all 0.2s ease-in-out'
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      variant="contained"
                      component={Link}
                      to="/register"
                      sx={{
                        fontWeight: 600,
                        borderRadius: 2,
                        px: 3,
                        textTransform: 'none',
                        bgcolor: 'rgba(255, 255, 255, 0.15)',
                        color: 'white',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.25)',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                        },
                        transition: 'all 0.2s ease-in-out'
                      }}
                    >
                      Register
                    </Button>
                  </>
                )}
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationClose}
        PaperProps={{
          sx: {
            width: 360,
            maxHeight: 400,
            mt: 1,
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            border: '1px solid rgba(0, 0, 0, 0.05)'
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            🔔 Notifications
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You have {notifications.length} new notifications
          </Typography>
        </Box>
        {notifications.map((notification) => (
          <MenuItem 
            key={notification.id}
            sx={{
              py: 1.5,
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
              <Typography sx={{ fontSize: '1.2rem', mr: 1.5, mt: 0.5 }}>
                {notification.type === 'alert' ? '🚨' :
                  notification.type === 'weather' ? '🌤️' : '👨‍🌾'}
              </Typography>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                  {notification.message}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {notification.time}
                </Typography>
              </Box>
            </Box>
          </MenuItem>
                  ))}
        <Divider />
        <MenuItem sx={{ justifyContent: 'center', py: 1.5 }}>
          <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
            View All Notifications
          </Typography>
        </MenuItem>
      </Menu>

      {/* Profile Menu */}
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 280,
            mt: 1,
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            border: '1px solid rgba(0, 0, 0, 0.05)'
          }
        }}
      >
        {/* Profile Header */}
        {user && (
          <Box sx={{ p: 3, bgcolor: 'primary.main', color: 'white' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  mr: 2,
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  fontWeight: 600
                }}
              >
                {user?.name?.charAt(0) || 'U'}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {user?.name || 'User'}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {user?.email || 'user@farmassist.com'}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip
                label="Premium Farmer"
                size="small"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 500
                }}
              />
              <Chip
                icon={<TrendingUp sx={{ fontSize: 16 }} />}
                label="Level 5"
                size="small"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 500
                }}
              />
            </Box>
          </Box>
        )}
        <Box sx={{ py: 1 }}>
          <MenuItem 
            onClick={handleClose}
            component={Link}
            to="/dashboard"
            sx={{
              '&:hover': {
                bgcolor: 'rgba(27, 94, 32, 0.08)'
              }
            }}
          >
            <ListItemIcon>
              <Dashboard fontSize="small" color="primary" />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </MenuItem>
          <MenuItem 
            onClick={handleClose}
            component={Link}
            to="/profile"
            sx={{
              '&:hover': {
                bgcolor: 'rgba(27, 94, 32, 0.08)'
              }
            }}
          >
            <ListItemIcon>
              <Person fontSize="small" color="primary" />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </MenuItem>
          <MenuItem 
            onClick={handleClose}
            component={Link}
            to="/settings"
            sx={{
              '&:hover': {
                bgcolor: 'rgba(27, 94, 32, 0.08)'
              }
            }}
          >
            <ListItemIcon>
              <Settings fontSize="small" color="primary" />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </MenuItem>
          <Divider sx={{ my: 1 }} />
          <MenuItem 
            onClick={handleLogout}
            sx={{
              '&:hover': {
                bgcolor: 'rgba(244, 67, 54, 0.08)'
              }
            }}
          >
            <ListItemIcon>
              <Logout fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText 
              primary="Logout"
              primaryTypographyProps={{ color: 'error' }}
            />
          </MenuItem>
        </Box>
      </Menu>

      {/* Add spacing for fixed navbar */}
      <Toolbar />
    </>
  );
};

export default Navbar;
