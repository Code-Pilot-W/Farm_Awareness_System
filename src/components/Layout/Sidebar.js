import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider
} from '@mui/material';
import {
  Dashboard,
  CloudQueue,
  Agriculture,
  BugReport,
  CalendarToday,
  QuestionAnswer,
  Newspaper,
  MenuBook
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const Sidebar = ({ mobileOpen, onDrawerToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Weather', icon: <CloudQueue />, path: '/weather' },
    { text: 'Crops', icon: <Agriculture />, path: '/crops' },
    { text: 'Pest Alerts', icon: <BugReport />, path: '/pest-alerts' },
    { text: 'Calendar', icon: <CalendarToday />, path: '/calendar' },
    { text: 'Expert Support', icon: <QuestionAnswer />, path: '/expert-support' },
    { text: 'News', icon: <Newspaper />, path: '/news' },
    { text: 'Resources', icon: <MenuBook />, path: '/resources' }
  ];

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Drawer
      variant="temporary"
      open={mobileOpen}
      onClose={onDrawerToggle}
      ModalProps={{ keepMounted: true }}
      sx={{
        display: { xs: 'block', sm: 'none' },
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
      }}
    >
      {drawer}
    </Drawer>
  );
};

export default Sidebar;
