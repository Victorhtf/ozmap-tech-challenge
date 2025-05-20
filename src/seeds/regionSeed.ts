import mongoose from 'mongoose';
import { Region } from '../models/Region';
import database from '../config/database';
import logger from '../config/logger';

const regions = [
  {
    name: 'Região Centro de São Paulo',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-46.65, -23.55],
          [-46.65, -23.53],
          [-46.63, -23.53],
          [-46.63, -23.55],
          [-46.65, -23.55],
        ],
      ],
    },
  },
  {
    name: 'Zona Sul de São Paulo',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-46.68, -23.59],
          [-46.68, -23.57],
          [-46.66, -23.57],
          [-46.66, -23.59],
          [-46.68, -23.59],
        ],
      ],
    },
  },
  {
    name: 'Zona Norte do Rio de Janeiro',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-43.28, -22.89],
          [-43.28, -22.87],
          [-43.26, -22.87],
          [-43.26, -22.89],
          [-43.28, -22.89],
        ],
      ],
    },
  },
  {
    name: 'Centro de Belo Horizonte',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-43.95, -19.93],
          [-43.95, -19.91],
          [-43.93, -19.91],
          [-43.93, -19.93],
          [-43.95, -19.93],
        ],
      ],
    },
  },
  {
    name: 'Região Metropolitana de Curitiba',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-49.3, -25.5],
          [-49.3, -25.4],
          [-49.2, -25.4],
          [-49.2, -25.5],
          [-49.3, -25.5],
        ],
      ],
    },
  },
  {
    name: 'Região da Avenida Paulista',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-46.665, -23.56],
          [-46.665, -23.555],
          [-46.655, -23.555],
          [-46.655, -23.56],
          [-46.665, -23.56],
        ],
      ],
    },
  },
  {
    name: 'Jardins - São Paulo',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-46.67, -23.565],
          [-46.67, -23.55],
          [-46.65, -23.55],
          [-46.65, -23.565],
          [-46.67, -23.565],
        ],
      ],
    },
  },
  {
    name: 'Consolação - São Paulo',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-46.665, -23.56],
          [-46.665, -23.545],
          [-46.65, -23.545],
          [-46.65, -23.56],
          [-46.665, -23.56],
        ],
      ],
    },
  },
];

async function seedRegions() {
  try {
    await database.connect();

    await Region.deleteMany({});

    await Region.insertMany(regions);

    await mongoose.disconnect();
    logger.info('Database successfully populated');

    process.exit(0);
  } catch (error) {
    logger.error(`Error populating database: ${error}`);
    process.exit(1);
  }
}

seedRegions();
