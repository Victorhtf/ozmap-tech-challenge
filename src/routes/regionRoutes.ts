import { Router } from 'express';
import RegionController from '../controllers/regionController';

const router = Router();

router.post('/', RegionController.createRegion);
router.get('/', RegionController.getAllRegions);
router.get('/:id', RegionController.getRegionById);
router.put('/:id', RegionController.updateRegion);
router.delete('/:id', RegionController.deleteRegion);

router.post('/coordinates', RegionController.getRegionsByCoordinates);

export default router;
