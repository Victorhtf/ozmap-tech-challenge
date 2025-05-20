import { expect } from 'chai';
import { describe, it, beforeEach, afterEach } from 'mocha';
import sinon from 'sinon';
import mongoose from 'mongoose';
import { Region } from '../../../src/models/Region';
import RegionService from '../../../src/services/regionService';
import { GeoJSONPolygon } from '../../../src/types';
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
        coordinates: [[
          [-46.65, -23.55],
          [-46.64, -23.55],
          [-46.64, -23.54],
          [-46.65, -23.54],
          [-46.65, -23.55]
        ]]
      };
      
      const expectedRegion = {
        _id: new mongoose.Types.ObjectId(),
        name: regionName,
        geometry
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
        coordinates: [[
          [-46.65, -23.55],
          [-46.64, -23.55],
          [-46.64, -23.54],
          [-46.65, -23.54],
          [-46.65, -23.55]
        ]]
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
            coordinates: [[
              [-46.65, -23.55],
              [-46.64, -23.55],
              [-46.64, -23.54],
              [-46.65, -23.54],
              [-46.65, -23.55]
            ]]
          }
        }
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
          coordinates: [[
            [-46.65, -23.55],
            [-46.64, -23.55],
            [-46.64, -23.54],
            [-46.65, -23.54],
            [-46.65, -23.55]
          ]]
        }
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
        coordinates: [[
          [-46.65, -23.55],
          [-46.64, -23.55],
          [-46.64, -23.54],
          [-46.65, -23.54],
          [-46.65, -23.55]
        ]]
      };
      
      const expectedRegion = {
        _id: regionId,
        name: regionName,
        geometry
      };
      
      const findByIdAndUpdateStub = sandbox.stub(Region, 'findByIdAndUpdate').resolves(expectedRegion as any);
      
      const result = await RegionService.updateRegion(regionId, regionName, geometry);
      
      expect(findByIdAndUpdateStub.calledOnce).to.be.true;
      expect(result).to.deep.equal(expectedRegion);
    });

    it('should return null when region not found', async () => {
      const regionId = new mongoose.Types.ObjectId().toString();
      const regionName = 'Região Centro de São Paulo Atualizada';
      const geometry: GeoJSONPolygon = {
        type: 'Polygon',
        coordinates: [[
          [-46.65, -23.55],
          [-46.64, -23.55],
          [-46.64, -23.54],
          [-46.65, -23.54],
          [-46.65, -23.55]
        ]]
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
          coordinates: [[
            [-46.65, -23.55],
            [-46.64, -23.55],
            [-46.64, -23.54],
            [-46.65, -23.54],
            [-46.65, -23.55]
          ]]
        }
      };
      
      const findByIdAndDeleteStub = sandbox.stub(Region, 'findByIdAndDelete').resolves(expectedRegion as any);
      
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
});
