import { Request, Response } from 'express';
import RegionService from '../services/regionService';
import { RegionCreate, RegionUpdate, RegionRequest, RequestWithI18n } from '../types';
import logger from '../config/logger';

export default class RegionController {
  static async createRegion(req: RegionRequest<RegionCreate> & RequestWithI18n, res: Response): Promise<void> {
    try {
      const { name, geometry } = req.body;
      logger.info(`Attempting to create region: ${name}`);

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
      logger.info(`Region created successfully: ${name}, ID: ${region.id}`);

      res.status(201).json({
        status: req.t('common.status.success'),
        message: req.t('region.success.create', { default: 'Region created successfully' }),
        results: 1,
        data: region,
      });
    } catch (error) {
      logger.error(`Error creating region: ${error instanceof Error ? error.message : 'Unknown error'}`);
      res.status(400).json({
        status: req.t('common.status.error'),
        message: error instanceof Error ? error.message : req.t('region.error.create'),
      });
    }
  }

  static async getAllRegions(req: Request & RequestWithI18n, res: Response): Promise<void> {
    try {
      logger.info('Fetching all regions');
      const regions = await RegionService.getAllRegions();
      logger.info(`${regions.length} regions found`);

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
      logger.info(`Fetching region by ID: ${id}`);
      
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

      logger.info(`Region found: ${region.name}, ID: ${region.id}`);
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
      logger.info(`Attempting to update region ID: ${id}, Name: ${name}`);
      
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

      logger.info(`Region updated successfully: ${name}, ID: ${id}`);
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
      logger.info(`Attempting to delete region: ${id}`);
      
      if (!id) {
        logger.warn('Region ID not provided for deletion');
        res.status(400).json({
          status: req.t('common.status.error'),
          message: req.t('region.validation.idRequired', { default: 'Region ID is required' }),
        });
        return;
      }
      
      const region = await RegionService.deleteRegion(id);
      
      if (!region) {
        logger.warn(`Region not found with ID: ${id}`);
        res.status(404).json({
          status: req.t('common.status.error'),
          message: req.t('region.error.notFound', { default: 'Region not found' }),
          results: 0
        });
        return;
      }

      logger.info(`Region deleted successfully: ${region.name}, ID: ${id}`);
      res.status(200).json({
        status: req.t('common.status.success'),
        message: req.t('region.success.delete', { default: 'Region deleted successfully' }),
        results: 1,
        data: region,
      });
    } catch (error) {
      logger.error(`Error deleting region: ${error instanceof Error ? error.message : 'Unknown error'}`);
      res.status(500).json({
        status: req.t('common.status.error'),
        message: error instanceof Error ? error.message : req.t('region.error.delete'),
      });
    }
  }

  static async getRegionsByCoordinates(req: Request & RequestWithI18n, res: Response): Promise<void> {
    try {
      const { coordinates } = req.body;
      logger.info(`Fetching regions by coordinates: [${coordinates}]`);
      
      const regions = await RegionService.getRegionsByCoordinates(coordinates);
      logger.info(`${regions.length} regions found by coordinates`);

      res.status(200).json({
        status: req.t('common.status.success'),
        message: req.t('region.success.getByCoordinates', { default: 'Regions retrieved by coordinates successfully' }),
        results: regions.length,
        data: regions,
      });
    } catch (error) {
      logger.error(`Error fetching regions by coordinates: ${error instanceof Error ? error.message : 'Unknown error'}`);
      res.status(500).json({
        status: req.t('common.status.error'),
        message: error instanceof Error ? error.message : req.t('region.error.getByCoordinates'),
      });
    }
  }

  static async getRegionsByAddress(req: Request & RequestWithI18n, res: Response): Promise<void> {
    try {
      const { address } = req.body;
      logger.info(`Fetching regions by address: ${address}`);

      if (!address) {
        logger.warn('Address not provided');
        res.status(400).json({
          status: req.t('common.status.error'),
          message: req.t('region.validation.addressRequired', { default: 'Address is required' }),
        });
        return;
      }

      const regions = await RegionService.getRegionsByAddress(address);
      logger.info(`${regions.length} regions found for address: ${address}`);
      
      res.status(200).json({
        status: req.t('common.status.success'),
        message: req.t('region.success.getByAddress', { default: 'Regions retrieved by address successfully' }),
        results: regions.length,
        data: regions,
        query: { address }
      });
    } catch (error) {
      logger.error(`Error fetching regions by address: ${error instanceof Error ? error.message : 'Unknown error'}`);
      res.status(500).json({
        status: req.t('common.status.error'),
        message: error instanceof Error ? error.message : req.t('region.error.getByAddress', { default: 'Error fetching regions by address' }),
      });
    }
  }

  static async getRegionsByDistance(req: Request & RequestWithI18n, res: Response): Promise<void> {
    try {
      const { point, distance } = req.body;
      logger.info(`Fetching regions by distance: ${distance}km from point [${point?.coordinates}]`);

      if (!point || !point.coordinates || !distance) {
        logger.warn('Point coordinates or distance not provided');
        res.status(400).json({
          status: req.t('common.status.error'),
          message: req.t('region.validation.pointDistanceRequired', { default: 'Point coordinates and distance are required' }),
        });
        return;
      }

      if (point.type !== 'Point') {
        logger.warn(`Invalid geometry type: ${point.type}, expected: Point`);
        res.status(400).json({
          status: req.t('common.status.error'),
          message: req.t('region.validation.pointType', { default: 'Geometry type must be Point' }),
        });
        return;
      }

      const distanceInKm = parseFloat(distance);
      if (isNaN(distanceInKm) || distanceInKm <= 0) {
        logger.warn(`Invalid distance value: ${distance}`);
        res.status(400).json({
          status: req.t('common.status.error'),
          message: req.t('region.validation.distanceInvalid', { default: 'Distance must be a positive number' }),
        });
        return;
      }

      const regions = await RegionService.getRegionsByDistance(point, distanceInKm);
      logger.info(`${regions.length} regions found within ${distanceInKm}km from point [${point.coordinates}]`);
      
      res.status(200).json({
        status: req.t('common.status.success'),
        message: req.t('region.success.getByDistance', { default: 'Regions retrieved by distance successfully' }),
        results: regions.length,
        data: regions,
        query: { point, distance: distanceInKm }
      });
    } catch (error) {
      logger.error(`Error fetching regions by distance: ${error instanceof Error ? error.message : 'Unknown error'}`);
      res.status(500).json({
        status: req.t('common.status.error'),
        message: error instanceof Error ? error.message : req.t('region.error.getByDistance', { default: 'Error fetching regions by distance' }),
      });
    }
  }
}
