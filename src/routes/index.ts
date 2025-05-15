import { Router, Request, Response } from 'express';
import regionRoutes from './regionRoutes';

class Routes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.setupHealthRoute();
    this.setupApiRoutes();
  }

  private setupHealthRoute(): void {
    this.router.get('/health', (req: Request, res: Response) => {
      res.status(200).json({
        status: 'success',
        message: 'API OzMap online',
        timestamp: new Date().toISOString(),
      });
    });
  }

  private setupApiRoutes(): void {
    this.router.use('/regions', regionRoutes);
  }
}

const routes = new Routes();
export default routes.router;
