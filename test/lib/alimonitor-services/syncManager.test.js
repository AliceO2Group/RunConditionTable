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
        monalisaServiceMC,
    },
} } = require('../../../app/lib/alimonitor-services/SyncManager.js');
const { databaseManager: {
    repositories: {
        RunRepository,
        RunDetectorsRepository,
        DetectorSubsystemRepository,
        DataPassRepository,
        SimulationPassRepository,
    },
    models: {
        Run,
        Period,
        DataPass,
    },
} } = require('../../../app/lib/database/DatabaseManager.js');
const { generateRandomBookkeepingCachedRawJsons } = require('./testutil/bookkeeping-cache-test-data.js');
const { generateRandomMonalisaCachedRawJsons } = require('./testutil/monalisa-cache-test-data.js');
const { generateRandomMonalisaMontecarloCachedRawJsons } = require('./testutil/monalisa-montecarlo-cache-test-data.js');

const assert = require('assert');
const { expect } = require('chai');
const { truncateDatabase } = require('./testutil/db-utils.js');

const artficialDataSizes = {
    bookkeepingService: {
        runsInOneFile: Number(process.env.BKP_RUNS_FETCH_LIMIT || 100),
        filesNo: 2,
    },
    monalisaService: {
        dataPassesNo: 10,
        minDetailsPerOneDataPass: 1,
        maxDetailsPerOneDataPass: 10,
    },
    monalisaServiceMC: {
        simulationPassesNo: 10,
    },
};

module.exports = () => describe('SyncManager suite', () => {
    before(async () => {
        await truncateDatabase();
        generateRandomBookkeepingCachedRawJsons(
            artficialDataSizes.bookkeepingService.runsInOneFile,
            artficialDataSizes.bookkeepingService.filesNo,
        );
        generateRandomMonalisaCachedRawJsons(
            artficialDataSizes.monalisaService.dataPassesNo,
            artficialDataSizes.monalisaService.minDetailsPerOneDataPass,
            artficialDataSizes.monalisaService.maxDetailsPerOneDataPass,
        );
        generateRandomMonalisaMontecarloCachedRawJsons(
            artficialDataSizes.monalisaServiceMC.simulationPassesNo,
        );
    });

    it('should fetch detectors data from DB the same as in config', async () => await DetectorSubsystemRepository
        .findAll({ raw: true })
        .then((detectorSubsystemData) => detectorSubsystemData.map(({ name }) => name))
        .then((detectorSubsystemNames) => expect(detectorSubsystemNames).to.have.same.members(detectors)));

    describe('BookkeepingService suite', () => {
        describe('with artificial cache data', () => {
            it('should performe sync of runs with random data withour major errors', async () => {
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
    });

    describe('MonalisaService suite', () => {
        describe('with artificial cache data', () => {
            it('should performe sync od data passes with random data without major errors', async () => {
                monalisaService.useCacheJsonInsteadIfPresent = true;
                assert.strictEqual(await monalisaService.setSyncTask(), true);
            });

            it('should fetch some data passes with associated Period and Runs directly from DB', async () => {
                const data = await DataPassRepository
                    .findAll({ include: [Run, Period] });

                expect(data).to.length.greaterThan(0); //TODO
                expect(data.map(({ Period }) => Period).filter((period) => period)).to.be.lengthOf(data.length);
            });
        });
    });

    describe('MonalisaServiceMC suite', () => {
        describe('with artificial cache data', () => {
            it('should performe sync of simulation passes with random data without major errors', async () => {
                monalisaServiceMC.useCacheJsonInsteadIfPresent = true;
                assert.strictEqual(await monalisaServiceMC.setSyncTask(), true);
            });

            it('should fetch some simulation passes with associated Periods, Runs and DataPasses directly from DB', async () => {
                const data = await SimulationPassRepository
                    .findAll({ include: [Run, Period, DataPass] });

                expect(data).to.length.greaterThan(0); //TODO

                /**
                 * Check if all simulation passes have associations with some periods and some data passes
                 * Each simulation pass has to have association with at least one data pass and with at least one period,
                 * The opposite means error in logic of the service;
                 */
                expect(data.map(({ Periods }) => Periods).filter((Periods) => Periods?.length > 0)).to.be.lengthOf(data.length);
                expect(data.map(({ DataPasses }) => DataPasses).filter((DataPasses) => DataPasses?.length > 0)).to.be.lengthOf(data.length);

                /**
                 * Runs associated with one simulation pass,
                 * should be noticed in database regardless
                 * of their presence in the Bookkeeping
                 * or lack of important features
                 */
                expect(data.map(({ Runs }) => Runs).filter((Runs) => Runs?.length > 0)).to.be.lengthOf(data.length);
            });
        });
    });
});
