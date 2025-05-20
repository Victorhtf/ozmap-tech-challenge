import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logger from './logger';

dotenv.config();

class Database {
  private static instance: Database;
  private mongoUri: string;
  private isConnected: boolean = false;

  private constructor() {
    const mongoUri = process.env.MONGO_URI;
    
    if (mongoUri) {
      this.mongoUri = mongoUri;
      return;
    }
    
    const username = process.env.MONGO_INITDB_ROOT_USERNAME;
    const password = process.env.MONGO_INITDB_ROOT_PASSWORD;
    const host = process.env.MONGO_INITDB_ROOT_HOST;
    const port = process.env.MONGO_INITDB_ROOT_PORT;
    const dbName = process.env.MONGO_INITDB_DATABASE;
    
    if (username && password) {
      this.mongoUri = `mongodb://${username}:${password}@${host}:${port}/${dbName}?authSource=admin`;
    } else {
      this.mongoUri = `mongodb://${host}:${port}/${dbName}`;      
    }
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      logger.info('Already connected to database');
      return;
    }

    try {
      await mongoose.connect(this.mongoUri);
      this.isConnected = true;
      logger.info('Successfully connected to MongoDB');
    } catch (error) {
      logger.error(`Failed to connect to MongoDB: ${error}`);
      process.exit(1);
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      logger.info('No active connection to disconnect');
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      logger.info('Successfully disconnected from MongoDB');
    } catch (error) {
      logger.error(`Failed to disconnect from MongoDB: ${error}`);
    }
  }

  public isConnectedToDatabase(): boolean {
    return this.isConnected;
  }
}

const database = Database.getInstance();

export const connectDB = (): Promise<void> => database.connect();
export const disconnectDB = (): Promise<void> => database.disconnect();

export default database;
