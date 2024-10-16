import fs from 'fs/promises';
import path from 'node:path';

// TODO: Define a City class with name and id properties

class City {
  constructor(public id: string, public name: string) {}
}

// TODO: Complete the HistoryService class
class HistoryService {
  private filePath: string;

  constructor() {
    this.filePath = path.join(__dirname, '../data/searchHistory.json');
  }
  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading file:');
      return [];
    }
  }
  private async write(cities: City[]): Promise<void> {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(cities, null, 2));
    } catch (error) {
      console.error('Error writing file:');
    }
  }
  async getCities(): Promise<City[]> {
    return await this.read();
  }
  async addCity(cityName: string): Promise<void> {
    const cities = await this.read();
    const newCity = new City(this.generateId(), cityName);
    cities.push(newCity);
    await this.write(cities);
  }
  async removeCity(id: string): Promise<void> {
    let cities = await this.read();
    cities = cities.filter((city) => city.id !== id);
    await this.write(cities);
  }
  private generateId(): string {
    return crypto.randomUUID();
  }
}

export default new HistoryService();
