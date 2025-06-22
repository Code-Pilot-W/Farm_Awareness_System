export const getWeatherBackground = (condition) => {
  const backgrounds = {
    sunny: 'linear-gradient(135deg, #FFA726 0%, #FFB74D 100%)',
    cloudy: 'linear-gradient(135deg, #78909C 0%, #90A4AE 100%)',
    rainy: 'linear-gradient(135deg, #42A5F5 0%, #64B5F6 100%)',
    stormy: 'linear-gradient(135deg, #5C6BC0 0%, #7986CB 100%)',
    snowy: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
    foggy: 'linear-gradient(135deg, #90A4AE 0%, #B0BEC5 100%)'
  };
  return backgrounds[condition] || backgrounds.sunny;
};

export const formatTemperature = (temp, unit = 'C') => {
  return `${Math.round(temp)}°${unit}`;
};

export const formatWindSpeed = (speed, unit = 'km/h') => {
  return `${Math.round(speed)} ${unit}`;
};
