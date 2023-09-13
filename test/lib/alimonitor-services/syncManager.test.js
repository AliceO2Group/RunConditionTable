/**
 * @license
 * Copyright 2019-2020 CERN and copyright holders of ALICE O2.
 * See http://alice-o2.web.cern.ch/copyright for details of the copyright holders.
 * All rights not expressly granted are reserved.
 *
 * This software is distributed under the terms of the GNU General Public
 * License v3 (GPL Version 3), copied verbatim in the file "COPYING".
 *
 * In applying this license CERN does not waive the privileges and immunities
 * granted to it by virtue of its status as an Intergovernmental Organization
 * or submit itself to any jurisdiction.
 */

const { rctData: { detectors } } = require('../../../app/lib/config/configProvider.js');
const { syncManager: {
    services: {
        bookkeepingService,
        monalisaService,
    },
} } = require('../../../app/lib/alimonitor-services/SyncManager.js');
const { databaseManager: {
    repositories: {
        RunRepository,
        RunDetectorsRepository,
        DetectorSubsystemRepository,
        DataPassRepository,
    },
    models: {
        Run,
        Period,
    },
} } = require('../../../app/lib/database/DatabaseManager.js');
const { generateRandomBookkeepingCachedRawJsons, cleanCachedBkpData } = require('./testutil/bookkeeping-cache-test-data.js');
const { generateRandomMonalisaCachedRawJsons, cleanCachedMonalisaData } = require('./testutil/monalisa-cache-test-data.js');
const assert = require('assert');
const { expect } = require('chai');

const artficialDataSizes = {
    bookkeepingService: {
        inOneFile: 100,
        filesNo: 2,
    },
    monalisaService: {
        size: 100,
        minDetailsPerOneDataPass: 1,
        maxDailsPerOneDataPass: 1,
    },
};

module.exports = () => describe('SyncManager suite', () => {
    before(() => {
        generateRandomBookkeepingCachedRawJsons(
            artficialDataSizes.bookkeepingService.inOneFile,
            artficialDataSizes.bookkeepingService.filesNo,
        );
        generateRandomMonalisaCachedRawJsons(
            artficialDataSizes.monalisaService.size,
            artficialDataSizes.monalisaService.minDetailsPerOneDataPass,
            artficialDataSizes.monalisaService.maxDailsPerOneDataPass,
        );
    });

    after(() => {
        cleanCachedBkpData();
        cleanCachedMonalisaData();
    });

    it('should fetch detectors data from DB the same as in config', async () => await DetectorSubsystemRepository
        .findAll({ raw: true })
        .then((detectoSubsystemData) => detectoSubsystemData.map(({ name }) => name))
        .then((detectoSubsystemNames) => expect(detectoSubsystemNames).to.have.same.members(detectors)));

    describe('BookkeepingService suite', () => {
        describe('with artificial cache data', () => {
            it('should performe sync with random data withour major errors', async () => {
                bookkeepingService.useCacheJsonInsteadIfPresent = true;
                expect(await bookkeepingService.setSyncTask()).to.be.equal(true);
            });

            it('should fetch some run data directly from DB', async () =>
                await RunRepository
                    .findAll({ raw: true })
                    .then((data) => expect(data).to.length.greaterThan(0))); //TODO

            it('should fetch some run_detector data directly from DB', async () =>
                await RunDetectorsRepository
                    .findAll({ raw: true })
                    .then((data) => expect(data).to.length.greaterThan(0))); //TODO
        });

        describe('without artificial cache data', () => {
            it('should performe sync with major error', async () => {
                bookkeepingService.useCacheJsonInsteadIfPresent = false;
                expect(await bookkeepingService.setSyncTask()).to.be.equal(false);
            });
        });
    });

    describe('MonalisaService suite', () => {
        describe('with artificial cache data', () => {
            it('should performe sync with random data without major errors', async () => {
                monalisaService.useCacheJsonInsteadIfPresent = true;
                assert.strictEqual(await monalisaService.setSyncTask(), true);
            });

            it('should fetch some data passes with associated Period and Runs directly from DB', async () => {
                const data = await DataPassRepository
                    .findAll({ include: [Run, Period] });

                expect(data).to.length.greaterThan(0); //TODO
                expect(data.map(({ Period }) => Period).filter((_) => _)).to.be.lengthOf(data.length);
            });
        });

        describe('without artificial cache data', () => {
            it('should performe sync with major error', async () => {
                monalisaService.useCacheJsonInsteadIfPresent = false;
                expect(await monalisaService.setSyncTask()).to.be.equal(false);
            });
        });
    });
});