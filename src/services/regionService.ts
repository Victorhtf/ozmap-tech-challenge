import { Region, IRegion } from '../models/Region';
import { GeoJSONPolygon, GeoJSONPoint } from '../types';
import i18next from '../config/i18n';
import axios from 'axios';

export default class RegionService {
  static async createRegion(name: string, geometry: GeoJSONPolygon): Promise<IRegion> {
    try {
      const region = await Region.create({ name, geometry });
      return region;
    } catch (error) {
      if (error instanceof Error && error.message.includes('duplicate key')) {
        throw new Error(i18next.t('region.error.duplicate', { name }));
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

  static async getRegionsByAddress(address: string): Promise<IRegion[]> {
    const country = process.env.COUNTRY_CODE || 'BR'

    try {
      const nominatimResponse = await axios.get(
        'https://nominatim.openstreetmap.org/search',
        {
          params: {
            q: address,
            countrycodes: country.toLowerCase(),
            format: 'json',
            limit: 1
          },
          headers: {
            'User-Agent': 'OzMap-API/1.0'
          }
        }
      );

      if (!nominatimResponse.data || nominatimResponse.data.length === 0) {
        return [];
      }

      const location = nominatimResponse.data[0];
      const lat = parseFloat(location.lat);
      const lon = parseFloat(location.lon);

      const point = {
        type: 'Point',
        coordinates: [lon, lat]
      };

      const regions = await Region.find({ geometry: { $geoIntersects: { $geometry: point } } });
      
      return regions;
    } catch (error) {
      console.error('Erro ao buscar regiões por endereço:', error);
      throw error;
    }
  }

  static async getRegionsByDistance(point: GeoJSONPoint, distanceInKm: number): Promise<IRegion[]> {
    try {
      const distanceInRadians = distanceInKm / 6371;

      const regions = await Region.find({
        geometry: {
          $geoWithin: {
            $centerSphere: [point.coordinates, distanceInRadians]
          }
        }
      });

      return regions;
    } catch (error) {
      console.error('Erro ao buscar regiões por distância:', error);
      throw error;
    }
  }
}
