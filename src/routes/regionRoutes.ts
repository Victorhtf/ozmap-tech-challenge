import { Router } from 'express';
import RegionController from '../controllers/regionController';

const router = Router();

router.post('/', RegionController.createRegion);
router.get('/', RegionController.getAllRegions);

export default router;
