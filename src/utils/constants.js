export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile'
  },
  WEATHER: {
    CURRENT: '/weather/current',
    FORECAST: '/weather/forecast'
  },
  CROPS: {
    LIST: '/crops',
    DETAILS: '/crops/:id',
    RECOMMENDATIONS: '/crops/recommendations'
  },
  PESTS: {
    ALERTS: '/pest-alerts',
    REPORT: '/pest-alerts/report'
  },
  CALENDAR: {
    TASKS: '/calendar/tasks',
    CREATE: '/calendar/tasks',
    UPDATE: '/calendar/tasks/:id',
    DELETE: '/calendar/tasks/:id'
  }
};

export const WEATHER_CONDITIONS = {
  SUNNY: 'sunny',
  CLOUDY: 'cloudy',
  RAINY: 'rainy',
  STORMY: 'stormy'
};

export const CROP_TYPES = {
  RICE: 'rice',
  WHEAT: 'wheat',
  MAIZE: 'maize',
  COTTON: 'cotton',
  SUGARCANE: 'sugarcane'
};

export const TASK_PRIORITIES = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
};

export const ALERT_SEVERITIES = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
};
