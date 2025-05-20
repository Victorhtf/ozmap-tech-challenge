import winston from 'winston';
import path from 'path';

class Logger {
  private static instance: Logger;
  private logger: winston.Logger;

  private levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  };

  private colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue',
  };

  private constructor() {
    winston.addColors(this.colors);

    this.logger = winston.createLogger({
      level: this.getLevel(),
      levels: this.levels,
      transports: this.getTransports(),
    });
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private getLevel(): string {
    const env = process.env.NODE_ENV || 'development';
    return env === 'development' ? 'debug' : 'info';
  }

  private getConsoleFormat(): winston.Logform.Format {
    return winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
      winston.format.printf((info) => {
        return `${info.timestamp} [${info.level.toUpperCase()}] ${info.message}`;
      })
    );
  }

  private getFileFormat(): winston.Logform.Format {
    return winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
      winston.format.json()
    );
  }

  private getTransports(): winston.transport[] {
    return [
      new winston.transports.Console({ format: this.getConsoleFormat() }),
      new winston.transports.File({
        filename: path.join('logs', 'error.log'),
        level: 'error',
        format: this.getFileFormat(),
      }),
      new winston.transports.File({
        filename: path.join('logs', 'all.log'),
        format: this.getFileFormat(),
      }),
    ];
  }

  public error(message: string, ...meta: any[]): void {
    this.logger.error(message, ...meta);
  }

  public warn(message: string, ...meta: any[]): void {
    this.logger.warn(message, ...meta);
  }

  public info(message: string, ...meta: any[]): void {
    this.logger.info(message, ...meta);
  }

  public http(message: string, ...meta: any[]): void {
    this.logger.http(message, ...meta);
  }

  public debug(message: string, ...meta: any[]): void {
    this.logger.debug(message, ...meta);
  }
}

export default Logger.getInstance();
