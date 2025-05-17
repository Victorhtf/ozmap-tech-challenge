import { Router, Request, Response } from 'express';
import regionRoutes from './regionRoutes';
import languageRoutes from './languageRoutes';
import { RequestWithI18n } from '../types/i18n';

class Routes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.setupHealthRoute();
    this.setupApiRoutes();
  }

  private setupHealthRoute(): void {
    this.router.get('/health', (req: Request & RequestWithI18n, res: Response) => {
      res.status(200).json({
        status: req.t('common.status.success'),
        message: req.t('api.health.online', { default: 'API OzMap online' }),
        timestamp: new Date().toISOString(),
        language: req.language
      });
    });
  }

  private setupApiRoutes(): void {
    this.router.use('/regions', regionRoutes);
    this.router.use('/language', languageRoutes);
  }
}

const routes = new Routes();
export default routes.router;
