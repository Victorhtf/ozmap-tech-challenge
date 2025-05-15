import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import routes from './src/routes/index';
import { connectDB } from './src/config/database';
import { errorHandler } from './src/middlewares/errorHandler';

class App {
  public app: Application;
  private port: number;

  constructor() {
    dotenv.config();
    
    this.app = express();
    this.port = parseInt(process.env.PORT || '3000', 10);
    
    this.configureMiddlewares();
    this.configureRoutes();
    this.configureErrorHandling();
  }

  private configureMiddlewares(): void {
    this.app.use(express.json());
    
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
      next();
    });
  }

  private configureRoutes(): void {
    this.app.use('/api', routes);
  }

  private configureErrorHandling(): void {
    this.app.use(errorHandler);
  }

  public async start(): Promise<void> {
    try {
      await connectDB();
      
      this.app.listen(this.port, () => {
        console.log(`Servidor rodando na porta ${this.port}`);
        console.log(`API disponível em http://localhost:${this.port}/api`);
      });
    } catch (error) {
      console.error('Erro ao iniciar o servidor:', error);
      process.exit(1);
    }
  }
}

const application = new App();
application.start();

export default application.app;
