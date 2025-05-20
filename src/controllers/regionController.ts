import { Request, Response } from 'express';
import RegionService from '../services/regionService';
import { RegionCreate, RegionUpdate, RegionRequest, RequestWithI18n } from '../types';

export default class RegionController {
  static async createRegion(req: RegionRequest<RegionCreate> & RequestWithI18n, res: Response): Promise<void> {
    try {
      const { name, geometry } = req.body;

      if (!name || !geometry || !geometry.coordinates || !geometry.type) {
        res.status(400).json({
          status: req.t('common.status.error'),
          message: req.t('region.validation.required'),
        });
        return;
      }

      if (geometry.type !== 'Polygon') {
        res.status(400).json({
          status: req.t('common.status.error'),
          message: req.t('region.validation.polygon'),
        });
        return;
      }

      const region = await RegionService.createRegion(name, geometry);

      res.status(201).json({
        status: req.t('common.status.success'),
        message: req.t('region.success.create', { default: 'Region created successfully' }),
        results: 1,
        data: region,
      });
    } catch (error) {
      res.status(400).json({
        status: req.t('common.status.error'),
        message: error instanceof Error ? error.message : req.t('region.error.create'),
      });
    }
  }

  static async getAllRegions(req: Request & RequestWithI18n, res: Response): Promise<void> {
    try {
      const regions = await RegionService.getAllRegions();

      res.status(200).json({
        status: req.t('common.status.success'),
        results: regions.length,
        data: regions,
      });
    } catch (error) {
      res.status(500).json({
        status: req.t('common.status.error'),
        message: error instanceof Error ? error.message : req.t('region.error.getAll'),
      });
    }
  }

  static async getRegionById(req: Request & RequestWithI18n, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          status: req.t('common.status.error'),
          message: req.t('region.validation.idRequired', { default: 'Region ID is required' }),
        });
        return;
      }

      const region = await RegionService.getRegionById(id);
      
      if (!region) {
        res.status(404).json({
          status: req.t('common.status.error'),
          message: req.t('region.error.notFound', { default: 'Region not found' }),
          results: 0
        });
        return;
      }

      res.status(200).json({
        status: req.t('common.status.success'),
        message: req.t('region.success.getById', { default: 'Region retrieved successfully' }),
        results: 1,
        data: region,
      });
    } catch (error) {
      res.status(500).json({
        status: req.t('common.status.error'),
        message: error instanceof Error ? error.message : req.t('region.error.getById'),
      });
    }
  }

  static async updateRegion(req: Request & RequestWithI18n, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, geometry } = req.body;
      
      if (!id) {
        res.status(400).json({
          status: req.t('common.status.error'),
          message: req.t('region.validation.idRequired', { default: 'Region ID is required' }),
        });
        return;
      }
      
      if (!name || !geometry || !geometry.coordinates || !geometry.type) {
        res.status(400).json({
          status: req.t('common.status.error'),
          message: req.t('region.validation.required'),
        });
        return;
      }

      if (geometry.type !== 'Polygon') {
        res.status(400).json({
          status: req.t('common.status.error'),
          message: req.t('region.validation.polygon'),
        });
        return;
      }
      
      const region = await RegionService.updateRegion(id, name, geometry);
      
      if (!region) {
        res.status(404).json({
          status: req.t('common.status.error'),
          message: req.t('region.error.notFound', { default: 'Region not found' }),
          results: 0
        });
        return;
      }

      res.status(200).json({
        status: req.t('common.status.success'),
        message: req.t('region.success.update', { default: 'Region updated successfully' }),
        results: 1,
        data: region,
      });
    } catch (error) {
      res.status(500).json({
        status: req.t('common.status.error'),
        message: error instanceof Error ? error.message : req.t('region.error.update'),
      });
    }
  }

  static async deleteRegion(req: Request & RequestWithI18n, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          status: req.t('common.status.error'),
          message: req.t('region.validation.idRequired', { default: 'Region ID is required' }),
        });
        return;
      }
      
      const region = await RegionService.deleteRegion(id);
      
      if (!region) {
        res.status(404).json({
          status: req.t('common.status.error'),
          message: req.t('region.error.notFound', { default: 'Region not found' }),
          results: 0
        });
        return;
      }

      res.status(200).json({
        status: req.t('common.status.success'),
        message: req.t('region.success.delete', { default: 'Region deleted successfully' }),
        results: 1,
        data: region,
      });
    } catch (error) {
      res.status(500).json({
        status: req.t('common.status.error'),
        message: error instanceof Error ? error.message : req.t('region.error.delete'),
      });
    }
  }

  static async getRegionsByCoordinates(req: Request & RequestWithI18n, res: Response): Promise<void> {
    try {
      const { coordinates } = req.body;
      const regions = await RegionService.getRegionsByCoordinates(coordinates);

      res.status(200).json({
        status: req.t('common.status.success'),
        message: req.t('region.success.getByCoordinates', { default: 'Regions retrieved by coordinates successfully' }),
        results: regions.length,
        data: regions,
      });
    } catch (error) {
      res.status(500).json({
        status: req.t('common.status.error'),
        message: error instanceof Error ? error.message : req.t('region.error.getByCoordinates'),
      });
    }
  }

  static async getRegionsByAddress(req: Request & RequestWithI18n, res: Response): Promise<void> {
    try {
      const { address } = req.body;

      if (!address) {
        res.status(400).json({
          status: req.t('common.status.error'),
          message: req.t('region.validation.addressRequired', { default: 'Address is required' }),
        });
        return;
      }

      const regions = await RegionService.getRegionsByAddress(address);
      
      res.status(200).json({
        status: req.t('common.status.success'),
        message: req.t('region.success.getByAddress', { default: 'Regions retrieved by address successfully' }),
        results: regions.length,
        data: regions,
        query: { address }
      });
    } catch (error) {
      res.status(500).json({
        status: req.t('common.status.error'),
        message: error instanceof Error ? error.message : req.t('region.error.getByAddress', { default: 'Error fetching regions by address' }),
      });
    }
  }

  static async getRegionsByDistance(req: Request & RequestWithI18n, res: Response): Promise<void> {
    try {
      const { point, distance } = req.body;

      if (!point || !point.coordinates || !distance) {
        res.status(400).json({
          status: req.t('common.status.error'),
          message: req.t('region.validation.pointDistanceRequired', { default: 'Point coordinates and distance are required' }),
        });
        return;
      }

      if (point.type !== 'Point') {
        res.status(400).json({
          status: req.t('common.status.error'),
          message: req.t('region.validation.pointType', { default: 'Geometry type must be Point' }),
        });
        return;
      }

      const distanceInKm = parseFloat(distance);
      if (isNaN(distanceInKm) || distanceInKm <= 0) {
        res.status(400).json({
          status: req.t('common.status.error'),
          message: req.t('region.validation.distanceInvalid', { default: 'Distance must be a positive number' }),
        });
        return;
      }

      const regions = await RegionService.getRegionsByDistance(point, distanceInKm);
      
      res.status(200).json({
        status: req.t('common.status.success'),
        message: req.t('region.success.getByDistance', { default: 'Regions retrieved by distance successfully' }),
        results: regions.length,
        data: regions,
        query: { point, distance: distanceInKm }
      });
    } catch (error) {
      res.status(500).json({
        status: req.t('common.status.error'),
        message: error instanceof Error ? error.message : req.t('region.error.getByDistance', { default: 'Error fetching regions by distance' }),
      });
    }
  }

}
