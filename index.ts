import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import routes from './src/routes/index';
import { connectDB } from './src/config/database';
import { errorHandler } from './src/middlewares/errorHandler';
import i18next from './src/config/i18n';
import middleware from 'i18next-http-middleware';
import { requestLogger, errorLogger } from './src/middleware/loggerMiddleware';
import fs from 'fs';
import logger from './src/config/logger';

class App {
  public app: Application;
  private port: number;

  constructor() {
    dotenv.config();

    this.app = express();
    this.port = parseInt(process.env.PORT || '3000', 10);

    this.ensureLogDirectory();
    this.configureMiddlewares();
    this.configureRoutes();
    this.configureErrorHandling();
  }

  private ensureLogDirectory(): void {
    const logDir = 'logs';
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir);
    }
  }

  private configureMiddlewares(): void {
    this.app.use(express.json());

    this.app.use(middleware.handle(i18next));

    this.app.use(requestLogger);
  }

  private configureRoutes(): void {
    this.app.use('/api', routes);
  }

  private configureErrorHandling(): void {
    this.app.use(errorLogger);
    this.app.use(errorHandler);
  }

  public async start(): Promise<void> {
    try {
      await connectDB();

      this.app.listen(this.port, () => {
        logger.info(`Server running on port ${this.port}`);
        logger.info(`API available at http://localhost:${this.port}/api`);
      });
    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }
}

const application = new App();
application.start();

export default application.app;
