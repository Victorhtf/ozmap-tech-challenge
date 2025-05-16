import { Request, Response } from 'express';
import RegionService from '../services/regionService';
import { RegionRequest } from '../types';

export default class RegionController {
  static async createRegion(req: RegionRequest, res: Response): Promise<void> {
    try {
      const { name, geometry } = req.body;

      if (!name || !geometry || !geometry.coordinates || !geometry.type) {
        res.status(400).json({
          status: 'error',
          message: 'Nome e geometria são obrigatórios',
        });
        return;
      }

      if (geometry.type !== 'Polygon') {
        res.status(400).json({
          status: 'error',
          message: 'A geometria deve ser do tipo Polygon',
        });
        return;
      }

      const region = await RegionService.createRegion(name, geometry);

      res.status(201).json({
        status: 'success',
        data: region,
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Erro ao criar região',
      });
    }
  }

  static async getAllRegions(_req: Request, res: Response): Promise<void> {
    try {
      const regions = await RegionService.getAllRegions();

      res.status(200).json({
        status: 'success',
        results: regions.length,
        data: regions,
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Erro ao buscar regiões',
      });
    }
  }
}
