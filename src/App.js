import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { GlobalStyles } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Navbar from './components/Layout/Navbar.js';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard';
import Weather from './pages/Weather';
import CropInfo from './pages/CropInfo';
import PestAlerts from './pages/PestAlerts';
import FarmingCalendar from './pages/FarmingCalendar';
import Resources from './pages/Resources';
import ExpertSupport from './pages/ExpertSupport';
import News from './pages/News';
// Tools components
import PlantingCalendar from './components/tools/PlantingCalendar';
import CropYieldEstimator from './components/tools/CropYieldEstimator';
import FertilizerCalculator from './components/tools/FertilizerCalculator';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Enhanced mature theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1b5e20', // Deeper, sophisticated green
      light: '#4c8c4a',
      dark: '#003d00',
    },
    secondary: {
      main: '#f57c00', // Refined orange
      light: '#ffad42',
      dark: '#bb4d00',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      letterSpacing: '-0.01em',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(0,0,0,0.15)',
            transform: 'translateY(-1px)',
            transition: 'all 0.2s ease-in-out',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 20px rgba(0,0,0,0.08)',
          borderRadius: 16,
          border: '1px solid rgba(0,0,0,0.06)',
          '&:hover': {
            boxShadow: '0px 8px 32px rgba(0,0,0,0.12)',
            transform: 'translateY(-2px)',
            transition: 'all 0.3s ease-in-out',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0px 1px 8px rgba(0,0,0,0.08)',
          color: '#212121',
        },
      },
    },
  },
});

// Global styles (inline instead of separate file)
const globalStyles = (
  <GlobalStyles
    styles={{
      '*': {
        boxSizing: 'border-box',
      },
      html: {
        scrollBehavior: 'smooth',
      },
      body: {
        fontFamily: '"Inter", sans-serif',
        backgroundColor: '#fafafa',
      },
      '::-webkit-scrollbar': {
        width: '8px',
      },
      '::-webkit-scrollbar-track': {
        background: '#f1f1f1',
      },
      '::-webkit-scrollbar-thumb': {
        background: '#c1c1c1',
        borderRadius: '4px',
      },
      '::-webkit-scrollbar-thumb:hover': {
        background: '#a8a8a8',
      },
    }}
  />
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {globalStyles}
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/weather" element={
                <ProtectedRoute>
                  <Weather />
                </ProtectedRoute>
              } />
              <Route path="/crops" element={
                <ProtectedRoute>
                  <CropInfo />
                </ProtectedRoute>
              } />
              <Route path="/pest-alerts" element={
                <ProtectedRoute>
                  <PestAlerts />
                </ProtectedRoute>
              } />
              <Route path="/calendar" element={
                <ProtectedRoute>
                  <FarmingCalendar />
                </ProtectedRoute>
              } />
              <Route path="/resources" element={
                <ProtectedRoute>
                  <Resources />
                </ProtectedRoute>
              } />
              <Route path="/expert-support" element={
                <ProtectedRoute>
                  <ExpertSupport />
                </ProtectedRoute>
              } />
              <Route path="/news" element={
                <ProtectedRoute>
                  <News />
                </ProtectedRoute>
              } />
              <Route path="/tools/planting-calendar" element={
                <ProtectedRoute>
                  <PlantingCalendar />
                </ProtectedRoute>
              } />
              <Route path="/tools/yield-estimator" element={
                <ProtectedRoute>
                  <CropYieldEstimator />
                </ProtectedRoute>
              } />
              <Route path="/tools/fertilizer-calculator" element={
                <ProtectedRoute>
                  <FertilizerCalculator />
                </ProtectedRoute>
              } />
            </Routes>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
