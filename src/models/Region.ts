import { Schema, model, Document } from 'mongoose';

export interface IRegion extends Document {
  name: string;
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
}

const RegionSchema = new Schema<IRegion>({
  name: {
    type: String,
    required: true,
  },
  geometry: {
    type: {
      type: String,
      required: true,
      enum: ['Polygon'],
    },
    coordinates: {
      type: [[[Number]]],
      required: true,
    },
  },
});

// Habilita o Mongo a fazer consultas inteligentes em um conteúdo geospacial
RegionSchema.index({ geometry: '2dsphere' });

export const Region = model<IRegion>('Region', RegionSchema);
