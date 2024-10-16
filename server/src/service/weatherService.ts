import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}
// TODO: Define a class for the Weather object
class Weather {
  constructor(
    public cityName: string,
    public date: string,
    public temperature: number,
    public humidity: number,
    public windSpeed: number,
    public description: string,
    public icon: string
  ) {}
}
// TODO: Complete the WeatherService class
class WeatherService {
  private baseURL: string;
  private apiKey: string;

  constructor() {
    this.baseURL = 'https://api.openweathermap.org';
    this.apiKey = process.env.OPENWEATHER_API_KEY || '18a0cd7ebcfe28f3e3f23359825e4208';
  }
private async fetchLocationData(query: string): Promise<Coordinates> {
  const geocodeUrl = this.buildGeocodeQuery(query);
  const response = await fetch(geocodeUrl);
  const data = await response.json();

  if (data.cod !== 200) {
    throw new Error('City not found');
  }

  return this.destructureLocationData(data);
}

private destructureLocationData(locationData: any): Coordinates {
  return {
    lat: locationData[0].lat,
    lon: locationData[0].lon,
  };
}

private buildGeocodeQuery(city: string): string {
  return `${this.baseURL}/weather?q=${city}&appid=${this.apiKey}`;
}
private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
  }
private async fetchAndDestructureLocationData(city: string): Promise<Coordinates> {
    return await this.fetchLocationData(city);
  }
private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const weatherUrl = this.buildWeatherQuery(coordinates);
    const response = await fetch(weatherUrl);
    const data = await response.json();
    return data;
  }
private parseCurrentWeather(response: any): Weather {
    const main = response.main;
    const weather = response.weather[0];

    return new Weather(
      response.name,
      new Date().toLocaleDateString(),
      main.temp,
      main.humidity,
      response.wind.speed,
      weather.description,
      weather.icon
    );
  }
     private buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather[] {
    return weatherData.map((item) => {
      const main = item.main;
      const weather = item.weather[0];

      return new Weather(
        currentWeather.cityName,
        item.dt_txt.split(' ')[0],
        main.temp,
        main.humidity,
        item.wind.speed,
        weather.description,
        weather.icon
      );
    });
  }
     async getWeatherForCity(city: string): Promise<{ currentWeather: Weather; forecast: Weather[] }> {
    const coordinates = await this.fetchAndDestructureLocationData(city);
    const weatherData = await this.fetchWeatherData(coordinates);

    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecastArray = this.buildForecastArray(currentWeather, weatherData.list);

    return { currentWeather, forecast: forecastArray };
  }
}

export default new WeatherService();
