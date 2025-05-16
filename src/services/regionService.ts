import { Region, IRegion } from '../models/Region';
import { GeoJSONPolygon } from '../types';

export default class RegionService {
  static async createRegion(name: string, geometry: GeoJSONPolygon): Promise<IRegion> {
    try {
      const region = await Region.create({ name, geometry });
      return region;
    } catch (error) {
      if (error instanceof Error && error.message.includes('duplicate key')) {
        throw new Error(`Região com o nome '${name}' já existe`);
      }
      throw error;
    }
  }

  static async getAllRegions(): Promise<IRegion[]> {
    return Region.find();
  }

  static async getRegionById(id: string): Promise<IRegion | null> {
    return Region.findById(id);
  }

  static async updateRegion(id: string, name: string, geometry: GeoJSONPolygon): Promise<IRegion | null> {
    return Region.findByIdAndUpdate(id, { name, geometry }, { new: true });
  }

  static async deleteRegion(id: string): Promise<IRegion | null> {
    return Region.findByIdAndDelete(id);
  }

  static async getRegionsByCoordinates(coordinates: GeoJSONPolygon): Promise<IRegion[]> {
    return Region.find({ geometry: { $geoIntersects: { $geometry: coordinates } } });
  }

  
}
