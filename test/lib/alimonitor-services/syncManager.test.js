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
const { syncManager } = require('../../../app/lib/alimonitor-services/SyncManager.js');
const { databaseManager: { repositories: {
    RunRepository,
    RunDetectorsRepository,
    DetectorSubsystemRepository,
},
} } = require('../../../app/lib/database/DatabaseManager.js');
const { generateRandomBookkeepingCachedRawJsons, cleanCachedBkpData } = require('./testutil/bookkeeping-cache-test-data.js');
const assert = require('assert');

module.exports = () => describe('SyncManager suite', () => {
    before('should fetch detectors data from DB the same as in config', async () => await DetectorSubsystemRepository
        .findAll({ raw: true })
        .then((detectoSubsystemData) => detectoSubsystemData.map(({ name }) => name))
        .then((detectoSubsystemNames) => assert.deepStrictEqual(detectoSubsystemNames.sort(), detectors.sort())));

    describe('BookkeepingService suite', () => {
        describe('with artificial cache data', () => {
            before(() => {
                generateRandomBookkeepingCachedRawJsons();
            });

            after(() => {
                cleanCachedBkpData();
            });

            it('should performe sync with random data withour major errors', async () => {
                assert.strictEqual(await syncManager.services.bookkeepingService.setSyncTask(), true);
            });

            it('should fetch some run data directly from DB', async () =>
                await RunRepository
                    .findAll({ raw: true })
                    .then((data) => assert(data.length > 0)));

            it('should fetch some run_detector data directly from DB', async () =>
                await RunDetectorsRepository
                    .findAll({ raw: true })
                    .then((data) => assert(data.length > 0)));
        });

        describe('without artificial cache data', () => {
            before(() => {
                syncManager.services.bookkeepingService.forceToUseOnlyCache = true;
            });

            after(() => {
                syncManager.services.bookkeepingService.forceToUseOnlyCache = false;
            });

            it('should performe sync with major error', async () => {
                assert.strictEqual(await syncManager.services.bookkeepingService.setSyncTask(), false);
            });
        });
    });
});
