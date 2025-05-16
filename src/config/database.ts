import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

class Database {
  private static instance: Database;
  private mongoUri: string;
  private isConnected: boolean = false;

  private constructor() {
    this.mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/';
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      console.log('Já está conectado ao MongoDB');
      return;
    }

    try {
      await mongoose.connect(this.mongoUri);
      this.isConnected = true;
      console.log('Conectado ao MongoDB com sucesso');
    } catch (error) {
      console.error('Erro ao conectar ao MongoDB:', error);
      process.exit(1);
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      console.log('Não há conexão ativa para desconectar');
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log('Desconectado do MongoDB com sucesso');
    } catch (error) {
      console.error('Erro ao desconectar do MongoDB:', error);
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
