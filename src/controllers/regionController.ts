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
      const { id } = req.body;
      const region = await RegionService.getRegionById(id);

      res.status(200).json({
        status: 'success',
        data: region,
      });
    } catch (error) {
      res.status(500).json({
        status: req.t('common.status.error'),
        message: error instanceof Error ? error.message : req.t('region.error.getById'),
      });
    }
  }

  static async updateRegion(req: RegionRequest<RegionUpdate> & RequestWithI18n, res: Response): Promise<void> {
    try {
      const { id, name, geometry } = req.body;
      const region = await RegionService.updateRegion(id, name, geometry);

      res.status(200).json({
        status: 'success',
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
      const { id } = req.body;
      const region = await RegionService.deleteRegion(id);

      res.status(200).json({
        status: 'success',
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
        data: regions,
      });
    } catch (error) {
      res.status(500).json({
        status: req.t('common.status.error'),
        message: error instanceof Error ? error.message : req.t('region.error.getByCoordinates'),
      });
    }
  }

}
