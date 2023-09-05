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

const { syncManager } = require('../../../app/lib/alimonitor-services/SyncManager.js');
const { databaseManager } = require('../../../app/lib/database/DatabaseManager.js');
const { generateRandomBookkeepingCachedRawJsons } = require('./testutil/cache-for-test.js');
const assert = require('assert');

module.exports = () => describe('SyncManager suite', () => {
    describe('BookkeepingService suite', () => {
        before(() => {
            generateRandomBookkeepingCachedRawJsons();
        });

        after(async () => {
            await databaseManager.repositories.RunRepository
                .findAll({ raw: true })
                .then((data) => assert(data.length > 0));
        });

        it('should performe sync with random data withour major errors', async () => {
            assert.strictEqual(await syncManager.services.bookkeepingService.setSyncTask(), true);
        });
    });
});
