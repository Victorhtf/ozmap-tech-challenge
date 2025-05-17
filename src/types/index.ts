import { Request } from 'express';
import { Document } from 'mongoose';
import { RequestWithI18n } from './i18n';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Address {
  street?: string;
  number?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  fullAddress: string;
}

// Tipos para polígono
export interface GeoJSONPolygon {
  type: 'Polygon';
  coordinates: number[][][];
}

// Tipos para regiões
export interface IRegion extends Document {
  name: string;
  geometry: GeoJSONPolygon;
  createdAt: Date;
  updatedAt: Date;
}

// Tipos para base de regiões
export interface RegionBase {
  name: string;
  geometry: GeoJSONPolygon;
}

// Tipos para requisições
export type RegionRequest<T = any> = Request<{}, {}, T>

// Tipos para craação e atualização de regiões
export interface RegionCreate extends RegionBase {}

// Tipos para atualização de regiões
export interface RegionUpdate extends RegionBase {
  id: string;
}

// Tipos para respostas
export interface ErrorResponse {
  status: string;
  message: string;
  stack?: string;
}

export interface SuccessResponse<T> {
  status: string;
  data: T;
}

export { RequestWithI18n };