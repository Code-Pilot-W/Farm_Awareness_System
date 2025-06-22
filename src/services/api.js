const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('authToken');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Weather API
  async getWeatherData(location) {
    return this.request(`/weather?location=${encodeURIComponent(location)}`);
  }

  async getWeatherForecast(location, days = 7) {
    return this.request(`/weather/forecast?location=${encodeURIComponent(location)}&days=${days}`);
  }

  // Crop API
  async getCrops() {
    return this.request('/crops');
  }

  async getCropById(id) {
    return this.request(`/crops/${id}`);
  }

  async getCropRecommendations(soilType, season, location) {
    return this.request(`/crops/recommendations?soilType=${soilType}&season=${season}&location=${location}`);
  }

  // Pest Alerts API
  async getPestAlerts() {
    return this.request('/pest-alerts');
  }

  async reportPestIssue(data) {
    return this.request('/pest-alerts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Farming Calendar API
  async getCalendarTasks(month) {
    return this.request(`/farming-calendar?month=${month}`);
  }

  async createTask(task) {
    return this.request('/farming-calendar', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  async updateTask(id, task) {
    return this.request(`/farming-calendar/${id}`, {
      method: 'PUT',
      body: JSON.stringify(task),
    });
  }

  async deleteTask(id) {
    return this.request(`/farming-calendar/${id}`, {
      method: 'DELETE',
    });
  }

  // Expert Support API
  async getQuestions() {
    return this.request('/expert-support/questions');
  }

  async submitQuestion(question) {
    return this.request('/expert-support/questions', {
      method: 'POST',
      body: JSON.stringify(question),
    });
  }

  // News API
  async getNews() {
    return this.request('/news');
  }

  async getNewsByCategory(category) {
    return this.request(`/news?category=${category}`);
  }

  // User Profile API
  async getUserProfile() {
    return this.request('/user/profile');
  }

  async updateUserProfile(profile) {
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  }

  // Authentication API
  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }
}

export default new ApiService();
