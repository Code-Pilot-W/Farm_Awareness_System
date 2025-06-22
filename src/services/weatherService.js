const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

class WeatherService {
  async getCurrentWeather(lat, lon) {
    if (!lat || !lon) {
      const position = await this.getLocation();
      lat = position.lat;
      lon = position.lon;
    }
    
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      temperature: Math.round(data.main.temp),
      condition: this.mapCondition(data.weather[0].main),
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6),
      location: data.name,
      country: data.sys.country,
      description: data.weather[0].description,
      feelsLike: Math.round(data.main.feels_like),
      pressure: data.main.pressure
    };
  }

  async getWeatherForecast(lat, lon) {
    if (!lat || !lon) {
      const position = await this.getLocation();
      lat = position.lat;
      lon = position.lon;
    }
    
    const response = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      throw new Error(`Forecast API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return this.processForecast(data.list);
  }

  getLocation() {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        () => resolve({ lat: 6.5244, lon: 3.3792 }) // Default to Lagos, Nigeria
      );
    });
  }

  mapCondition(condition) {
    const map = { 
      'Clear': 'sunny', 
      'Clouds': 'cloudy', 
      'Rain': 'rainy',
      'Drizzle': 'rainy',
      'Thunderstorm': 'stormy',
      'Snow': 'snowy',
      'Mist': 'foggy',
      'Fog': 'foggy',
      'Haze': 'foggy'
    };
    return map[condition] || 'sunny';
  }

  processForecast(list) {
    const daily = {};
    list.forEach(item => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!daily[date]) {
        daily[date] = {
          date: item.dt * 1000,
          temperature: Math.round(item.main.temp),
          condition: this.mapCondition(item.weather[0].main),
          humidity: item.main.humidity
        };
      }
    });
    return Object.values(daily).slice(0, 7);
  }
}

// Fix: Assign to variable before exporting
const weatherServiceInstance = new WeatherService();
export default weatherServiceInstance;
