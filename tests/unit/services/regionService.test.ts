import { expect } from 'chai';
import { describe, it, beforeEach, afterEach } from 'mocha';
import sinon from 'sinon';
import mongoose from 'mongoose';
import axios from 'axios';
import { Region } from '../../../src/models/Region';
import RegionService from '../../../src/services/regionService';
import { GeoJSONPolygon, GeoJSONPoint } from '../../../src/types';
import logger from '../../../src/config/logger';
import i18next from 'i18next';

describe('RegionService', () => {
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('createRegion', () => {
    it('should create a region successfully', async () => {
      const regionName = 'Região Centro de São Paulo';
      const geometry: GeoJSONPolygon = {
        type: 'Polygon',
        coordinates: [
          [
            [-46.65, -23.55],
            [-46.64, -23.55],
            [-46.64, -23.54],
            [-46.65, -23.54],
            [-46.65, -23.55],
          ],
        ],
      };

      const expectedRegion = {
        _id: new mongoose.Types.ObjectId(),
        name: regionName,
        geometry,
      };

      const createStub = sandbox.stub(Region, 'create').resolves(expectedRegion as any);

      const result = await RegionService.createRegion(regionName, geometry);

      expect(createStub.calledOnce).to.be.true;
      expect(result).to.deep.equal(expectedRegion);
    });

    it('should throw an error when region with same name already exists', async () => {
      const regionName = 'Região Centro de São Paulo';
      const geometry: GeoJSONPolygon = {
        type: 'Polygon',
        coordinates: [
          [
            [-46.65, -23.55],
            [-46.64, -23.55],
            [-46.64, -23.54],
            [-46.65, -23.54],
            [-46.65, -23.55],
          ],
        ],
      };

      const duplicateError = new Error('E11000 duplicate key error');
      sandbox.stub(Region, 'create').throws(duplicateError);

      const i18nStub = sandbox.stub(i18next, 't').returns('Region already exists');

      try {
        await RegionService.createRegion(regionName, geometry);
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error).to.be.an.instanceOf(Error);
      }
    });
  });

  describe('getAllRegions', () => {
    it('should return all regions', async () => {
      const expectedRegions = [
        {
          _id: new mongoose.Types.ObjectId(),
          name: 'Região Centro de São Paulo',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [-46.65, -23.55],
                [-46.64, -23.55],
                [-46.64, -23.54],
                [-46.65, -23.54],
                [-46.65, -23.55],
              ],
            ],
          },
        },
      ];

      const findStub = sandbox.stub(Region, 'find').resolves(expectedRegions as any);

      const result = await RegionService.getAllRegions();

      expect(findStub.calledOnce).to.be.true;
      expect(result).to.deep.equal(expectedRegions);
    });
  });

  describe('getRegionById', () => {
    it('should return a region by id', async () => {
      const regionId = new mongoose.Types.ObjectId().toString();
      const expectedRegion = {
        _id: regionId,
        name: 'Região Centro de São Paulo',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-46.65, -23.55],
              [-46.64, -23.55],
              [-46.64, -23.54],
              [-46.65, -23.54],
              [-46.65, -23.55],
            ],
          ],
        },
      };

      const findByIdStub = sandbox.stub(Region, 'findById').resolves(expectedRegion as any);

      const result = await RegionService.getRegionById(regionId);

      expect(findByIdStub.calledOnce).to.be.true;
      expect(result).to.deep.equal(expectedRegion);
    });

    it('should return null when region not found', async () => {
      const regionId = new mongoose.Types.ObjectId().toString();
      const findByIdStub = sandbox.stub(Region, 'findById').resolves(null);

      const result = await RegionService.getRegionById(regionId);

      expect(findByIdStub.calledOnce).to.be.true;
      expect(result).to.be.null;
    });
  });

  describe('updateRegion', () => {
    it('should update a region successfully', async () => {
      const regionId = new mongoose.Types.ObjectId().toString();
      const regionName = 'Região Centro de São Paulo Atualizada';
      const geometry: GeoJSONPolygon = {
        type: 'Polygon',
        coordinates: [
          [
            [-46.65, -23.55],
            [-46.64, -23.55],
            [-46.64, -23.54],
            [-46.65, -23.54],
            [-46.65, -23.55],
          ],
        ],
      };

      const expectedRegion = {
        _id: regionId,
        name: regionName,
        geometry,
      };

      const findByIdAndUpdateStub = sandbox
        .stub(Region, 'findByIdAndUpdate')
        .resolves(expectedRegion as any);

      const result = await RegionService.updateRegion(regionId, regionName, geometry);

      expect(findByIdAndUpdateStub.calledOnce).to.be.true;
      expect(result).to.deep.equal(expectedRegion);
    });

    it('should return null when region not found', async () => {
      const regionId = new mongoose.Types.ObjectId().toString();
      const regionName = 'Região Centro de São Paulo Atualizada';
      const geometry: GeoJSONPolygon = {
        type: 'Polygon',
        coordinates: [
          [
            [-46.65, -23.55],
            [-46.64, -23.55],
            [-46.64, -23.54],
            [-46.65, -23.54],
            [-46.65, -23.55],
          ],
        ],
      };

      const findByIdAndUpdateStub = sandbox.stub(Region, 'findByIdAndUpdate').resolves(null);

      const result = await RegionService.updateRegion(regionId, regionName, geometry);

      expect(findByIdAndUpdateStub.calledOnce).to.be.true;
      expect(result).to.be.null;
    });
  });

  describe('deleteRegion', () => {
    it('should delete a region successfully', async () => {
      const regionId = new mongoose.Types.ObjectId().toString();
      const expectedRegion = {
        _id: regionId,
        name: 'Região Centro de São Paulo',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-46.65, -23.55],
              [-46.64, -23.55],
              [-46.64, -23.54],
              [-46.65, -23.54],
              [-46.65, -23.55],
            ],
          ],
        },
      };

      const findByIdAndDeleteStub = sandbox
        .stub(Region, 'findByIdAndDelete')
        .resolves(expectedRegion as any);

      const result = await RegionService.deleteRegion(regionId);

      expect(findByIdAndDeleteStub.calledOnce).to.be.true;
      expect(result).to.deep.equal(expectedRegion);
    });

    it('should return null when region not found', async () => {
      const regionId = new mongoose.Types.ObjectId().toString();
      const findByIdAndDeleteStub = sandbox.stub(Region, 'findByIdAndDelete').resolves(null);

      const result = await RegionService.deleteRegion(regionId);

      expect(findByIdAndDeleteStub.calledOnce).to.be.true;
      expect(result).to.be.null;
    });
  });

  describe('getRegionsByCoordinates', () => {
    it('should return regions that intersect with the given coordinates', async () => {
      const coordinates: GeoJSONPolygon = {
        type: 'Polygon',
        coordinates: [
          [
            [-46.65, -23.55],
            [-46.64, -23.55],
            [-46.64, -23.54],
            [-46.65, -23.54],
            [-46.65, -23.55],
          ],
        ],
      };

      const expectedRegions = [
        {
          _id: new mongoose.Types.ObjectId(),
          name: 'Região Centro de São Paulo',
          geometry: coordinates,
        },
      ];

      const findStub = sandbox.stub(Region, 'find').resolves(expectedRegions as any);

      const result = await RegionService.getRegionsByCoordinates(coordinates);

      expect(findStub.calledOnce).to.be.true;
      expect(result).to.deep.equal(expectedRegions);
    });
  });

  describe('getRegionsByAddress', () => {
    it('should return regions that contain the address coordinates', async () => {
      const address = 'Avenida Paulista, São Paulo';
      const nominatimResponse = {
        data: [
          {
            lat: '-23.5505',
            lon: '-46.6333',
          },
        ],
      };

      const expectedRegions = [
        {
          _id: new mongoose.Types.ObjectId(),
          name: 'Região Centro de São Paulo',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [-46.65, -23.55],
                [-46.64, -23.55],
                [-46.64, -23.54],
                [-46.65, -23.54],
                [-46.65, -23.55],
              ],
            ],
          },
        },
      ];

      process.env.COUNTRY_CODE = 'BR';

      const axiosGetStub = sandbox.stub(axios, 'get').resolves(nominatimResponse);
      const findStub = sandbox.stub(Region, 'find').resolves(expectedRegions as any);

      const result = await RegionService.getRegionsByAddress(address);

      expect(axiosGetStub.calledOnce).to.be.true;
      expect(findStub.calledOnce).to.be.true;
      expect(result).to.deep.equal(expectedRegions);
    });

    it('should return empty array when address is not found', async () => {
      const address = 'Endereço Inexistente';
      const nominatimResponse = {
        data: [],
      };

      const axiosGetStub = sandbox.stub(axios, 'get').resolves(nominatimResponse);

      const result = await RegionService.getRegionsByAddress(address);

      expect(axiosGetStub.calledOnce).to.be.true;
      expect(result).to.be.an('array').that.is.empty;
    });

    it('should throw error when nominatim API fails', async () => {
      const address = 'Avenida Paulista, São Paulo';
      const apiError = new Error('API Error');

      const axiosGetStub = sandbox.stub(axios, 'get').rejects(apiError);
      const loggerStub = sandbox.stub(logger, 'error');

      try {
        await RegionService.getRegionsByAddress(address);
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error).to.equal(apiError);
        expect(loggerStub.calledOnce).to.be.true;
      }
    });
  });

  describe('getRegionsByDistance', () => {
    it('should return regions within the specified distance from a point', async () => {
      const point: GeoJSONPoint = {
        type: 'Point',
        coordinates: [-46.6333, -23.5505],
      };
      const distanceInKm = 5;

      const expectedRegions = [
        {
          _id: new mongoose.Types.ObjectId(),
          name: 'Região Centro de São Paulo',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [-46.65, -23.55],
                [-46.64, -23.55],
                [-46.64, -23.54],
                [-46.65, -23.54],
                [-46.65, -23.55],
              ],
            ],
          },
        },
      ];

      const findStub = sandbox.stub(Region, 'find').resolves(expectedRegions as any);

      const result = await RegionService.getRegionsByDistance(point, distanceInKm);

      expect(findStub.calledOnce).to.be.true;
      expect(result).to.deep.equal(expectedRegions);
    });

    it('should throw error when database query fails', async () => {
      const point: GeoJSONPoint = {
        type: 'Point',
        coordinates: [-46.6333, -23.5505],
      };
      const distanceInKm = 5;

      const dbError = new Error('Database Error');
      const findStub = sandbox.stub(Region, 'find').rejects(dbError);
      const loggerStub = sandbox.stub(logger, 'error');

      try {
        await RegionService.getRegionsByDistance(point, distanceInKm);
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error).to.equal(dbError);
        expect(loggerStub.calledOnce).to.be.true;
      }
    });
  });
});
