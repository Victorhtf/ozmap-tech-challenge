import { Request } from 'express';

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

export interface GeocodingResponse {
  coordinates: Coordinates;
  formattedAddress?: string;
  success: boolean;
  error?: string;
}

export interface RegionRequest extends Request {
  params: {
    id?: string;
  };
  body: {
    name?: string;
    geometry?: {
      type: 'Polygon';
      coordinates: number[][][];
    };
  };
  query: {
    latitude?: string;
    longitude?: string;
    distance?: string;
    address?: string;
  };
}

export interface ErrorResponse {
  status: string;
  message: string;
  stack?: string;
}

export interface SuccessResponse<T> {
  status: string;
  data: T;
}
