import { Router } from 'express';
import LanguageController from '../controllers/languageController';

const router = Router();

router.post('/change', LanguageController.changeLanguage);

router.get('/current', LanguageController.getCurrentLanguage);

export default router;
