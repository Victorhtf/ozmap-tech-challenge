import expressWinston from 'express-winston';
import winston from 'winston';
import path from 'path';

class LoggerMiddleware {
  private static instance: LoggerMiddleware;

  private constructor() {}

  public static getInstance(): LoggerMiddleware {
    if (!LoggerMiddleware.instance) {
      LoggerMiddleware.instance = new LoggerMiddleware();
    }
    return LoggerMiddleware.instance;
  }

  private getConsoleFormat(): winston.Logform.Format {
    return winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
      winston.format.printf(
        (info) => `${info.timestamp} [${info.level.toUpperCase()}] ${info.message}`
      )
    );
  }

  private getFileFormat(): winston.Logform.Format {
    return winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
      winston.format.json()
    );
  }

  public getRequestLogger() {
    return expressWinston.logger({
      transports: [
        new winston.transports.Console({
          format: this.getConsoleFormat()
        }),
        new winston.transports.File({
          filename: path.join('logs', 'requests.log'),
          format: this.getFileFormat()
        }),
      ],
      meta: true,
      msg: 'HTTP {{req.method}} {{req.url}}',
      expressFormat: true,
      colorize: false,
      ignoreRoute: (req, res) => false,
    });
  }

  public getErrorLogger() {
    return expressWinston.errorLogger({
      transports: [
        new winston.transports.Console({
          format: this.getConsoleFormat()
        }),
        new winston.transports.File({
          filename: path.join('logs', 'errors.log'),
          format: this.getFileFormat()
        }),
      ],
      meta: true,
      msg: 'HTTP {{req.method}} {{req.url}}',
    });
  }
}

const loggerMiddleware = LoggerMiddleware.getInstance();

export const requestLogger = loggerMiddleware.getRequestLogger();
export const errorLogger = loggerMiddleware.getErrorLogger();
