import mongoose from 'mongoose';
import { Region } from '../models/Region';
import database from '../config/database';

const regions = [
  {
    name: 'Região Centro de São Paulo',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-46.6500, -23.5500],
        [-46.6500, -23.5300],
        [-46.6300, -23.5300],
        [-46.6300, -23.5500],
        [-46.6500, -23.5500]
      ]]
    }
  },
  {
    name: 'Zona Sul de São Paulo',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-46.6800, -23.5900],
        [-46.6800, -23.5700],
        [-46.6600, -23.5700],
        [-46.6600, -23.5900],
        [-46.6800, -23.5900]
      ]]
    }
  },
  {
    name: 'Zona Norte do Rio de Janeiro',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-43.2800, -22.8900],
        [-43.2800, -22.8700],
        [-43.2600, -22.8700],
        [-43.2600, -22.8900],
        [-43.2800, -22.8900]
      ]]
    }
  },
  {
    name: 'Centro de Belo Horizonte',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-43.9500, -19.9300],
        [-43.9500, -19.9100],
        [-43.9300, -19.9100],
        [-43.9300, -19.9300],
        [-43.9500, -19.9300]
      ]]
    }
  },
  {
    name: 'Região Metropolitana de Curitiba',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-49.3000, -25.5000],
        [-49.3000, -25.4000],
        [-49.2000, -25.4000],
        [-49.2000, -25.5000],
        [-49.3000, -25.5000]
      ]]
    }
  },
  {
    name: 'Região da Avenida Paulista',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-46.6650, -23.5600], // Ponto sudoeste (SW)
        [-46.6650, -23.5550], // Ponto noroeste (NW)
        [-46.6550, -23.5550], // Ponto nordeste (NE)
        [-46.6550, -23.5600], // Ponto sudeste (SE)
        [-46.6650, -23.5600]  // Fechamento do polígono (igual ao primeiro ponto)
      ]]
    }
  },
  {
    name: 'Jardins - São Paulo',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-46.6700, -23.5650],
        [-46.6700, -23.5500],
        [-46.6500, -23.5500],
        [-46.6500, -23.5650],
        [-46.6700, -23.5650]
      ]]
    }
  },
  {
    name: 'Consolação - São Paulo',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-46.6650, -23.5600],
        [-46.6650, -23.5450],
        [-46.6500, -23.5450],
        [-46.6500, -23.5600],
        [-46.6650, -23.5600]
      ]]
    }
  }
];

async function seedRegions() {
  try {
    await database.connect();

    await Region.deleteMany({});

    await Region.insertMany(regions);

    await mongoose.disconnect();
    console.log('Banco de dados populado com sucesso')

    process.exit(0);
  } catch (error) {
    console.error('Erro ao popular o banco de dados:', error);
    process.exit(1);
  }
}

seedRegions();
